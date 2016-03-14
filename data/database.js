class Note {
  static _lastId = 0;

  constructor({ id, text }) {
    this.id = id || ++Note._lastId;
    this.text = text;
    this.timestamp = Date.now().toString();
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
  'Hello, dear diary',
  'Today is a beautiful day'
].map((text) =>
  new Note({ text })
);

const notebook = new Notebook({ notes });

module.exports = {
  // Export methods that your schema can use to interact with your database
  getNote: (id) => notes.find((n) => n.id === id),
  getNotes: () => notes,
  getNotebook: () => notebook,
  Note,
};
