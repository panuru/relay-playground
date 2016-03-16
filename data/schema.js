/* eslint no-unused-vars: 0, no-use-before-define: 0 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Note,
  Notebook,
  getNote,
  getNotebook,
  addNote,
  updateNote,
  deleteNote,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'Note') {
      return getNote(id);
    } else if (type === 'Notebook') {
      return getNotebook();
    }

    return null;
  },

  (obj) => {
    if (obj instanceof Note) {
      return noteType;
    } else if (obj instanceof Notebook) {
      return notebookType;
    }

    return null;
  }
);

const noteType = new GraphQLObjectType({
  name: 'Note',
  description: 'A text note authored by the user of our app',
  fields: () => ({
    id: globalIdField('Note'),
    text: {
      type: GraphQLString,
      description: 'Some insightful content',
    },
    timestamp: {
      type: GraphQLFloat,
      description: 'The exact moment when the note was created, in milliseconds',
    },
  }),
  interfaces: [nodeInterface],
});

const notebookType = new GraphQLObjectType({
  name: 'Notebook',
  description: 'A notebook containing a collection of notes',
  fields: () => ({
    id: globalIdField('Notebook'),
    notesCount: {
      type: GraphQLInt,
      description: 'Total count of notes'
    },
    notes: {
      type: noteConnection,
      description: 'A list of notes',
      args: connectionArgs,
      resolve: (notebook, args) => connectionFromArray(notebook.notes, args),
    }
  }),
  interfaces: [nodeInterface],
});

const { connectionType: noteConnection } =
  connectionDefinitions({ name: 'Note', nodeType: noteType });

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    notebook: {
      type: notebookType,
      resolve: () => getNotebook(),
    },
  }),
});

const AddNoteMutation = mutationWithClientMutationId({
  name: 'AddNote',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    notebook: {
      type: notebookType,
      resolve: () => getNotebook(),
    }
  },
  mutateAndGetPayload: ({ text }) => {
    const note = new Note({ text });
    addNote(note);
    return note;
  },
});

const UpdateNoteMutation = mutationWithClientMutationId({
  name: 'UpdateNote',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    note: {
      type: noteType,
      resolve: (note) => note,
    }
  },
  mutateAndGetPayload: ({ id, text }) => {
    const noteId = parseInt(fromGlobalId(id).id, 10);
    const note = updateNote(noteId, { text });
    return note;
  },
});

const DeleteNoteMutation = mutationWithClientMutationId({
  name: 'DeleteNote',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    notebook: {
      type: notebookType,
      resolve: () => getNotebook(),
    },
    deletedId: {
      type: GraphQLID,
      resolve: (id) => id,
    }
  },
  mutateAndGetPayload: ({ id, text }) => {
    const noteId = parseInt(fromGlobalId(id).id, 10);
    deleteNote(noteId);
    return { id };
  },
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addNote: AddNoteMutation,
    updateNote: UpdateNoteMutation,
    deleteNote: DeleteNoteMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
