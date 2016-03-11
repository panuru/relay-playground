class Note {
  constructor(id, text, timestamp) {
    this.id = id;
    this.text = text;
    this.timestamp = timestamp;
  }
}

class Notebook {
  constructor(id) {
    this.id = id;
    this.notes = [];
  }
}

// Mock data
const notes = ['Hello, dear diary', 'Today is a beautiful day'].map((text, ix) =>
  new Note(ix, text, Date.now().toString())
);

const notebook = new Notebook(1);

module.exports = {
  // Export methods that your schema can use to interact with your database
  getNote: (id) => notes.find((n) => n.id === id),
  getNotes: () => notes,
  getNotebook: () => notebook,
  Note,
};
