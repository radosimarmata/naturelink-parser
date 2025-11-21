# Naturelink Binary Protocol Parser
A professional JavaScript/Node.js parser for decoding **Naturelink NL01/NL02 binary telemetry protocol**, including AVL records, GPS data, and a complete IO Element interpreter.

## 📜 Project Description
Naturelink devices transmit compact binary frames over TCP, containing IMEI, GPS coordinates, timestamps, and a wide range of IO elements.  


## ✨ Key Features
* **Binary Protocol Handling:** 
* **Professional Data Normalization:** 
* **Structured Output Format:** 
* **Extensive Data Support:** 
* **Debugging Fallback:** 

## 🛠️ Installation and Setup
This project requires a Node.js environment due to its reliance on the `Buffer` object.
1.  **Clone the Repository:**
```
git clone https://github.com/radosimarmata/naturelink-parser
```

```
cd naturelink-parser
```

```
npm install
```
```
npm run example

```

## 🧪 Running Tests
```
npm test
```

## 📂 Directory Structure
```
LICENSE
package.json
.prettierrc
.eslintrc.json
docs/
examples/
  basic.js
src/
  index.js
  helpers/
    buffer.js
    event-map.js
    imei.js
  io/
    interpret-io.js
    types-io.js
  parser/
    index.js
    naturelink-parser.js
test/
  parser.test.js
```