import { decodeAllSync, encodeAsync } from "cbor";

const authData = [
  163, 99, 102, 109, 116, 100, 110, 111, 110, 101, 103, 97, 116, 116, 83, 116,
  109, 116, 160, 104, 97, 117, 116, 104, 68, 97, 116, 97, 88, 152, 154, 215,
  134, 142, 130, 142, 26, 11, 85, 205, 68, 12, 126, 45, 244, 31, 79, 64, 108,
  131, 211, 14, 101, 179, 97, 216, 130, 132, 60, 177, 158, 181, 93, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 167, 140, 190, 0, 118,
  136, 177, 74, 254, 64, 116, 164, 177, 12, 8, 173, 242, 213, 40, 236, 165, 1,
  2, 3, 38, 32, 1, 33, 88, 32, 3, 253, 203, 206, 147, 71, 12, 53, 238, 205, 101,
  81, 217, 123, 213, 253, 230, 167, 113, 33, 235, 44, 204, 249, 37, 17, 9, 122,
  104, 99, 230, 99, 34, 88, 32, 116, 40, 54, 31, 27, 117, 234, 192, 29, 107,
  107, 100, 41, 234, 111, 131, 42, 148, 118, 41, 49, 47, 118, 7, 76, 169, 62,
  165, 162, 62, 224, 29,
];

(async function main() {
  let decode = decodeAllSync(Uint8Array.from(authData))[0];
  let buffer = decode.authData;

  // Example 7 : https://www.w3.org/TR/webauthn-2/#sctn-encoded-credPubKey-examples
  let credpubkey = buffer.slice(buffer.length - 77);
  let x = credpubkey.slice(10, 10 + 32);
  let y = credpubkey.slice(76);
  let compressed;
  if (y & 0) {
    console.log("even - 0x02");
    compressed = Buffer.from([0x02, ...x]);
  } else {
    console.log("odd - 0x03");
    compressed = Buffer.from([0x03, ...x]);
  }

  console.log("x: ", x);
  console.log("compressed: ", compressed);
})();
