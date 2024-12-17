class CustomAPIError extends Error {
  public statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = 500
    Object.setPrototypeOf(this, CustomAPIError.prototype)
  }
}

export default CustomAPIError
