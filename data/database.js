class Note {
  static _lastId = 0;

  constructor({ id, text, timestamp }) {
    this.id = id || ++Note._lastId;
    this.text = text;
    this.timestamp = timestamp || Date.now();
  }
}

class Notebook {
  static _lastId = 0;

  constructor({ id, notes }) {
    this.id = id || ++Notebook._lastId;
    this.notes = notes || [];
  }
}

// Mock data
const notes = [
  { text: 'Hello, dear diary', timestamp: '2016-01-01' },
  { text: 'Today is a beautiful day', timestamp: '2016-03-01' },
].map(({ text, timestamp }) =>
  new Note({ text, timestamp: new Date(timestamp) })
);

const notebook = new Notebook({ notes });

module.exports = {
  // Export methods that your schema can use to interact with your database
  getNote: (id) => notes.find((n) => n.id === id),
  getNotes: () => notes,
  getNotebook: () => notebook,
  Note,
};
