export default class Todo {
  constructor(title, content, tags) {
    this.id = Date.now().toString(36);
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.done = false;
  }
}
