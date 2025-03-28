export class TeacherUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeacherUnavailableError';
    Object.setPrototypeOf(this, TeacherUnavailableError.prototype);
  }
}
