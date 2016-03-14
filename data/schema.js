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
  getNotes,
  getNotebook,
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
      type: GraphQLString,
      description: 'The exact moment when the note was created',
    },
  }),
  interfaces: [nodeInterface],
});

const notebookType = new GraphQLObjectType({
  name: 'Notebook',
  description: 'A notebook containing a collection of notes',
  fields: () => ({
    id: globalIdField('Notebook'),
    notes: {
      type: noteConnection,
      description: 'A list of notes',
      args: connectionArgs,
      resolve: (notebook, args) => connectionFromArray(getNotes(), args),
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
    const notebook = getNotebook();
    const note = new Note({ text });
    notebook.notes.push(note);
    return note;
  },
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addNote: AddNoteMutation
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
