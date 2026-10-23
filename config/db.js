require(`dotenv`).config(); /*Fungsi kode ini adalah membaca konfigurasi yang disimpan di file .env, lalu membuatnya tersedia melalui process.env. ,
contohnya ada di file .env*/

const mysql =require(`mysql2/promise`); /*Kode ini mengambil modul mysql2/promise, yaitu library untuk berkomunikasi dengan database MySQL menggunakan Promise.
nanti buat di controllers nya dia bisa pake promise dan callback ataupun async await */

const dbUrl = process.env.DATABASE_URL /*Kode ini mengambil nilai variabel DATABASE_URL dari lingkungan aplikasi. intinya ini bersakngkutan dengan line 1 
jika ingi memanggil yang ada di dalam file .env kita harus memanggil env nya dengan cara seperti di line 1 DATABASE_URL kan ada di dalam .env */
if (!dbUrl){
    throw new Error("DATABASE_URL belum diset di .env");
} /* bagian ini adalah memeriksa apakah database url tersedia jika tidak dia muncul bacaan DATABASE_URL belum diset/setting di .env , intinya jika kita sudah di masukin DATABASE_URL nya di dalam
file .env dia ga akan muncul pesan  itu tadi, dia bakal aman aman aja*/


const url = new URL(dbUrl); /* Baris ini mengubah string URL menjadi objek URL sehingga setiap bagian alamat database bisa diakses melalui properti tertentu.
Intinya: new URL(dbUrl) memudahkan kita mengambil bagian-bagian URL tanpa perlu memisahkannya secara manual. */

// koneksi untuk melakukan crud
const pool = mysql.createPool({ //pool adalah kumpulan koneksi MySQL yang dikelola dan dapat digunakan kembali oleh aplikasi.
    host : url.hostname, //Menentukan alamat server MySQL. Contohnya, localhost berarti MySQL berjalan di komputer kamu sendiri.
    user : url.username, // Menentukan username yang digunakan untuk login ke MySQL, misalnya root.
    password : url.password,//Menentukan password akun MySQL yang diambil dari URL database.  Nilai ini harus sesuai dengan konfigurasi akun MySQL kamu.
    database : url.pathname.replace(/^\//,""), //path tanpa leading slash
    port : url.port? Number(url.port) : 3306, //Kode ini menggunakan operator ternary untuk menentukan port database. port nya bisa di sesuaikan dengan yang ada di mysql kita
    waitForConnections : true, //Jika semua koneksi yang tersedia sedang digunakan, permintaan koneksi baru dapat menunggu antrean daripada langsung ditolak karena pool penuh.
    connectionLimit : 10, //Menentukan maksimal 10 koneksi aktif dalam pool pada saat bersamaan. Angka 10 adalah konfigurasi yang kamu pilih, bukan batas wajib untuk semua aplikasi.
    queueLimit : 0 // Menentukan batas jumlah permintaan koneksi yang mengantre. Nilai 0 berarti tidak ada batas antrean yang ditetapkan oleh opsi ini.
});

module.exports = pool;