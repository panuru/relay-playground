const note = {
  text: 'hello',
  id: 1,
  timestamp: Date.now()
};

const notebook = {
  notes: {
    edges: [
      { node: note }
    ]
  },
  id: 1,
  notesCount: 1
};

export default { note, notebook };
