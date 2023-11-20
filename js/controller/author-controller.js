const dbConfig = require("../config/db-config");
const mysql = require("mysql2");
//create pool menghubungkan projek ke db hanya seklai di awal
const pool = mysql.createPool(dbConfig);

pool.on("error", (err) => {
  console.error(err);
});
//munjulin error di console

const responseAuthorNotFound = (res) => //bagian function yang bagia row function
  res.status(404).json({
    success: false,
    message: "Author Not Found",
  });
const responseSuccess = (res, result, message) =>
  res.status(200).json({
    success: true,
    message: message,
    data: result,
  });
//untuk membuat format hasil API kalo http response status code nya 400an
//untuk membuat format hasil API kalo http response status code nya 200an

const getAuthors = (req, res) => {
  const query = "SELECT * FROM author;";

  pool.getConnection((err, connection) => {
    //menyambungkan ke configurasi
    //err proses erornya
    //connecsi buat konek databasenya
    if (err) throw err;
    //kalau pass prosez awal koneksi ketemu error kode di bawah bakal di skip dan mengembalikan hasil respon eenya
    connection.query(query, (err, result) => {
      //menjalankan perintah sql parametenya ada 3. 1 2 variabel tipe 3 function
      // 1 variabel perintah sql
      // 2 optional mengirim data tambah/  update
      // 3function menangani reqs nya : 2 parameter (mengambil data err mengambil data hasil)
      if (err) throw err;

      responseSuccess(res, result, "Author successfully fetched");
    });

    connection.release();
    //memberhentikan koneksi kalo usah querynya sudah selesai terpenihi
  });
};

const addAuthor = (req, res) => {
    const data = {
      name: req.body.name,
      city: req.body.city,
      publisher: req.body.publisher,
      year: req.body.year,
      editor: req.body.editor,
    };

    const query = "INSERT INTO Author SET ?;";
    //?parameter yang harus di isi 
    //?diidi sama connection parameter ke 2

    pool.getConnection((err, connection) => {
      if (err) throw err;

      connection.query(query, [data], (err, result) => {
        if (err) throw err;

        responseSuccess(res, result, "Author successfully added");
      });

      connection.release();
    });
  };

  const getAuthor = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM author WHERE id = ${id};`;
  
    pool.getConnection((err, connection) => {
      if (err) throw err;
  
      connection.query(query, (err, result) => {
        if (err) throw err;

        if(result.length == 0) {
            responseAuthorNotFound(res);
            return;
        }
  
        responseSuccess(res, result, "Author successfully fetched");
      });
  
      connection.release();
    });
  };

  const editAuthor = (req, res) => {
    const data = {
        name: req.body.name,
        city: req.body.city,
        publisher: req.body.publisher,
        year: req.body.year,
        editor: req.body.editor,
      }
    const id = req.params.id

    const query = `UPDATE author SET ? WHERE id = ${id};`
    //; untuk di akses di cmd
    //{}mengabilvariabel

    pool.getConnection((err, connection) => {
      if (err) throw err

      connection.query(query, [data], (err, result) => {
         if (err) throw err

         if(result.affectedRows == 0) {
          responseAuthorNotFound(res)
          return
         }

         responseSuccess(res, result, 'Author successfully update')
      })
    })
  }


  const deleteAuthor = (req, res) => {
    const id = req.params.id

    const query = `DELETE FROM author WHERE id = ${id}`

    pool.getConnection((err, connection) => {
      if(err) throw err

      connection.query(query, (err, result) => {
        if(err) throw err

        if(result.affectedRows == 0) {
          responseAuthorNotFound(res)
          return
        }
        responseSuccess(res, result, 'Author successfully deleted')
      })
    })
  }

module.exports = {
  getAuthors, addAuthor, getAuthor, editAuthor, deleteAuthor
};
//kalo ga di export ga kepanggil