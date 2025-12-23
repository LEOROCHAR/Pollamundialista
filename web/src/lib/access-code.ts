import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0, I/1
const nanoid = customAlphabet(alphabet, 8);

export function generateAccessCode() {
  return nanoid();
}

