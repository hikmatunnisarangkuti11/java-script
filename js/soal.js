const express = require('express');
const app = express();

const tugas = [
    { nama: "A", hasil: true, waktu: 3000 },
    { nama: "B", hasil: false, waktu: 1000 },
    { nama: "C", hasil: false, waktu: 2000 },
    { nama: "D", hasil: true, waktu: 4000 },
];

async function fakTugas(tugasItem) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (tugasItem.hasil) {
                resolve(`Berhasil: ${tugasItem.nama} operasi berhasil!`);
            } else {
                reject(`Gagal: ${tugasItem.nama} operasi gagal!`);
            }
        }, tugasItem.waktu);
    });
}

app.get('/', async (req, res) => {
    const results = [];
    
    for (const tugasItem of tugas) {
        try {
            const result = await fakTugas(tugasItem);
            results.push(result);
        } catch (error) {
            results.push(error);
        }
    }

    results.forEach(result => console.log(result)); // Output ke konsol
    res.json({ results });
});

const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});