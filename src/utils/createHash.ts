import { createHash } from "crypto"

const hashString = (string: string) =>
  createHash("md5").update(string).digest("hex")

export default hashString
