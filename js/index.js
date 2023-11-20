const express = require("express");
//memanggil file buatan swndiri
const bookRouter = require("./routes/book-route");
const authorRouter = require("./routes/author-route");
const authRouter = require('./routes/auth-route');
const jwt = require('jsonwebtoken')
const cors = require('cors')
const accessTokenSecret = '2023-Wikrama-exp'



//menjalankan fremword express
const app = express();
//json tipedata objek di sebut json
//use express.json ketika mengirim data g=hanya bisa menggunakan format json
app.use(express.json())

app.use(
  //urlcode : mengubah request dari url menjadi format json dan membaca karakter
  //ketika kita mengirim data url misalnya name = atun dia akan di ubah menjadi json
  express.urlencoded({
    extended: true,
  })
)

app.use(cors())

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(403).json({message: "Unauthorized"})
  }
  const token = authHeader.split('')[1]

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if(err) {
      return res.status(403).json({message: "Unauthorized"})
    }
    next()
  })
}

const PORT = 3000;

app.use("/auth", authRouter);
app.use("/book",  bookRouter);
//milldewelr itu mengatur hak izin akses
app.use("/author", authorRouter);
app.use("/book/:id/:bookname/:year", (req, res) => {//req user ke server
  //path di laravel{} kalo di express pake :
  //path di dinamis isinya bisa berubah rubah
  res.send((req.params))
})
app.get('/filter', (req,res) => {
  res.send(req.query)
})
//26-53 routing url



//http://localhost:3000/filter?id=1&bookname=atun&year=2000
//app.get,post,use di masukan rute nya, lalu di isi dengan function/route

// app.get('/', (req, res) => res.send('Hello word'))
// app.get('/wikrama', (req, res) => res.send('Hello wikrama'))
// app.get('/about', (req, res) => res.send('Hello ini halaman about'))


app.listen(PORT, () =>
  console.log(`Server ini berjalan di http://localhost:${PORT}`)
);

//app.listen menjalnkan aplikasi di post yang sudah di definisikan