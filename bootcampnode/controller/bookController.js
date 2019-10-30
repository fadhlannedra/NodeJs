const Books = require('../models').Books;
// var jsonResult = require('../controller/jsonResult')
var PDFMake = require('pdfmake')
var path = require('path')

function responseMessage(code, message, data) {
    return {
        code: code,
        message: message,
        data: data
    }
}

function successMessage(data) {
    return responseMessage(200, 'data success', data)
}

function errorMessage(code, message) {
    return responseMessage(code, message, null)
}


var Controller = function () {

}

// var books = [
//     {
//         "id" : "1 ",
//         "judul" : "Gombal Warming",
//         "penerbit" : "Elexmedia",
//         "harga" : "75000",
//         "stok" : "45"
//     },
//     {
//         "id" : "2",
//         "judul" : "Mahir Angular 10 Menit",
//         "penerbit" : "Elexmedia",
//         "harga" : "79000",
//         "stok" : "50"
//     },
//     {
//         "id" : "3",
//         "judul" : "Parangtritis Saat Hujan",
//         "penerbit" : "Elexmedia",
//         "harga" : "95000",
//         "stok" : "49"
//     }
// ];

Controller.download = function (req, res, next) {
    
    Books
    .findAll()
    .then (result => {
    var printer = new PDFMake({
        Roboto: {
            normal: path.resolve('assets', 'fonts', 'roboto', 'Roboto-Regular.ttf'),
            italics: path.resolve('assets', 'fonts', 'roboto', 'Roboto-Italic.ttf'),
            bold: path.resolve('assets', 'fonts', 'roboto', 'Roboto-Bold.ttf'),
        }
    });

    
    var doc = printer.createPdfKitDocument({
        info: {
            title: "laporan Table Buku",
            author: "Fadhlan Cipta Nugraha",
            subject: "Buku",
        },
        
        content: [
            {text: "List Buku", style:"subheader"},
    
           
            {
                style: 'bookSTable',
                table: {
                    headerRows: 1,
                    body: [
                        [
                            { text: "Book ID", style: "tableHeader" },
                            { text: "TItle", style: "tableHeader"},
                            { text: "Author", style: "tableHeader"},
                            { text: "Price", style: "tableHeader"},
                            { text: "Stock", style: "tableHeader"}

                        ],
                        ...result.map(result => [
                            result.book_id,
                            result.title,
                            result.author,
                            result.price,
                            result.stock
                        ])
                    ]
                }
            }
        ]
    })

    doc.end()

    res.setHeader('Content-type', 'application/pdf')
    res.setHeader('Content-disposition', 'inline; filename="Example.pdf"')
    doc.pipe(res)

})
.catch(errorMessage => {
    tableBuku = responseMessage(500, errorMessage);
});
};



Controller.find = function (req, res, next) {
    var id = req.params.book_id
    Books.findOne({ where: { book_id: id } }).then(entity => {
        if (entity) {
            res.json(successMessage(entity))
        }
        else {
            throw ("buku tidak di temukan");
        }
    }).catch(error => {
        res.json(errorMessage(500, error.message))
    })

}



Controller.findAll = function (req, res, next) {
    Books.findAll().then(entities => {
        res.json(successMessage(entities))
    }).catch(error => {
        res.json(errorMessage(500, error.message))
    })
}

Controller.add = function (req, res, next) {
    var data = req.body
    console.log(data)
    Books.create(data).then(entity => {
        if (entity) {
            res.json(successMessage(entity))
        }
        else {
            throw ("Gagal Membuat");
        }

    }).catch(error => {
        res.json(errorMessage(500, error.message))
    })

}

Controller.update = function (req, res, next) {
    var data = req.body
    Books.findOne({where: {book_id:req.params.book_id}})
    .then(entity => { //kalo promise ada return then maka akan terus mencari then berikutnya
        if (entity) {
            return entity.update(data)
        } else {
            throw 'Books Not Found';
        }
    }).then(entity => {
        console.log(entity)
        res.json(successMessage(entity))
    }).catch(error => {
        res.json(errorMessage(500, error.message))
    })
}


Controller.delete = function (req, res, next) {
    var id = req.params.book_id
    Books.destroy({where: {book_id:id}}).then(affectedRows => {
        if (affectedRows) {
            res.json(successMessage(true))
        } else {
            throw 'Delete failed'
        }
    }).catch(error => {
        res.json(errorMessage(500, error.message))
    })
}



module.exports = Controller 