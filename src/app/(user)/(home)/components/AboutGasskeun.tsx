"use client";
import Container from "@/components/global/Container/Container";
import React, { useState } from "react";

export default function AboutGasskeun() {
  const [show, setShowAbout] = useState(false);
  return (
    <section className="py-16 lg:py-24">
      <Container
        className={` ${
          show ? "h-auto" : "h-64"
        } relative overflow-hidden transition-all`}
      >
        <h1 className="text-neutral-900 text-center max-w-3/4 max-auto font-bold text-sm md:text-lg">
          Top Up Mobile Legend, Free Fire, dan Game Lainnya Dengan Beragam
          Metode Pembayaran di Gasskeuntopup
        </h1>
        <section id="intro">
          <p className="text-center text-sm mt-4">
            Selamat datang di Gasskeuntopup, platform terbaik untuk top up
            Mobile Legend, Free Fire, dan berbagai game lainnya. Kami menawarkan
            beragam metode pembayaran yang aman dan cepat untuk memastikan Anda
            bisa menikmati permainan tanpa hambatan.
          </p>
        </section>
        <section id="benefits" className="mt-8">
          <h2 className="font-bold text-sm text-neutral-800">
            Mengapa Memilih Gasskeuntopup?
          </h2>
          <p className="text-sm">
            Gasskeuntopup adalah pilihan utama bagi gamers untuk top up dan beli
            voucher game karena beberapa alasan utama:
          </p>
          <ul className="list-disc mt-2 mt-2 list-inside">
            <li className="text-sm">
              <strong>Beragam Metode Pembayaran:</strong> Kami menyediakan
              banyak pilihan pembayaran, termasuk transfer bank ( BCA, Mandiri,
              BRI, BNI, Permata, CIMB Niaga, Danamon, Maybank, Neo Commerce,
              BSI, BJB), e-wallet (Dana, Gopay, Ovo, QRIS, ShopeePay, LinkAja),
              Pulsa (XL, TRI, TELKOMSEL), Retail (ALFAMART, INDOMART) dan
              lain-lain.
            </li>
            <li className="text-sm">
              <strong>Proses Cepat dan Mudah:</strong> Top up segera diproses
              setelah pembayaran berhasil.
            </li>
            <li className="text-sm">
              <strong>Keamanan Terjamin:</strong> Sistem kami dilengkapi dengan
              keamanan tinggi untuk melindungi setiap transaksi.
            </li>
            <li className="text-sm">
              <strong>Harga Murah:</strong> Dapatkan harga terbaik dan berbagai
              penawaran menarik.
            </li>
            <li className="text-sm">
              <strong>Layanan Pelanggan Responsif:</strong> Tim kami siap
              membantu Anda 24/7.
            </li>
          </ul>
        </section>
        <section id="how-to" className="mt-8">
          <h2 className="font-bold text-sm text-neutral-800">
            Cara Top Up di Gasskeuntopup
          </h2>
          <p className="text-sm">
            Ikuti langkah-langkah berikut untuk melakukan top up:
          </p>
          <ol className="list-decimal mt-2 list-inside">
            <li className="text-sm">
              Masuk ke website{" "}
              <a href="https://gasskeuntopup.com">gasskeuntopup.com</a>
            </li>
            <li className="text-sm">Pilih game yang ingin Anda top up.</li>
            <li className="text-sm">Masukkan detail akun game Anda.</li>
            <li className="text-sm">Pilih produk yang mau anda beli.</li>
            <li className="text-sm">Pilih jumlah top up yang diinginkan.</li>
            <li className="text-sm">
              Pilih metode pembayaran yang anda inginkan.
            </li>
            <li className="text-sm">Masukan kode promo (opsional)</li>
            <li className="text-sm">
              Lalu klik “Beli Sekarang”. Anda akan diarahkan pada halaman
              pembayaran dengan informasi detail bagaimana cara melakukan
              pembayaran
            </li>
            <li className="text-sm">Lakukan pembayaran sesuai instruksi.</li>
            <li className="text-sm">
              Saldo atau voucher akan langsung masuk ke akun game Anda setelah
              pembayaran selesai.
            </li>
          </ol>
        </section>
        <section id="games" className="mt-8">
          <h2 className="font-bold text-sm text-neutral-800">
            Game yang Tersedia di Gasskeuntopup
          </h2>
          <p className="text-sm">
            Kami menyediakan layanan top up untuk berbagai game populer,
            termasuk:
          </p>
          <ul className="list-disc mt-2 list-inside">
            <li className="text-sm">Mobile Legends</li>
            <li className="text-sm">Free Fire</li>
            <li className="text-sm">PUBG Mobile</li>
            <li className="text-sm">Clash of Clans</li>
            <li className="text-sm">Highs Domino</li>
            <li className="text-sm">Bigo Live</li>
            <li className="text-sm">Free Fire Max</li>
            <li className="text-sm">Valorant</li>
            <li className="text-sm">Genshin Crystal</li>
            <li className="text-sm">Honor of Kings</li>
            <li className="text-sm">Moonlight Blade</li>
            <li className="text-sm">Garena Undawn</li>
          </ul>
        </section>
        <section id="advantages" className="mt-8">
          <h2 className="font-bold text-sm text-neutral-800">
            Keuntungan Menggunakan Gasskeuntopup
          </h2>
          <p className="text-sm">
            Top up dan beli voucher di Gasskeuntopup menawarkan banyak
            keuntungan:
          </p>
          <ul className="list-disc mt-2 list-inside">
            <li className="text-sm">
              <strong>Harga Termurah:</strong> Kami menawarkan harga terbaik di
              pasaran.
            </li>
            <li className="text-sm">
              <strong>Pembayaran Mudah:</strong> Banyak pilihan metode
              pembayaran.
            </li>
            <li className="text-sm">
              <strong>Transaksi Cepat:</strong> Proses top up instan dan tanpa
              hambatan.
            </li>
            <li className="text-sm">
              <strong>Garansi Uang Kembali:</strong> Jaminan uang kembali jika
              terjadi masalah.
            </li>
            <li className="text-sm">
              <strong>Promo dan Penawaran:</strong> Berbagai promo menarik yang
              bisa Anda manfaatkan.
            </li>
            <li className="text-sm">
              <strong>Layanan Pelanggan 24/7:</strong> Tim kami siap membantu
              kapan saja.
            </li>
          </ul>
        </section>
        <section id="promo" className="mt-8">
          <h2 className="font-bold text-sm text-neutral-800">
            Promo dan Penawaran Terbaru
          </h2>
          <p className="text-sm">
            Dapatkan penawaran terbaik dengan promo-promo terbaru kami. Jangan
            lewatkan kesempatan untuk mendapatkan top up game dengan harga
            spesial dan berbagai bonus menarik lainnya.
          </p>
        </section>

        <section id="faq" className="mt-8">
          <h2 className="font-bold text-sm text-neutral-800">
            Pertanyaan sering diajukan
          </h2>
          <dl className="divide-y dark:divide-gray-300">
            <div className="py-2 space-y-2 md:grid md:grid-cols-12 md:gap-8 md:space-y-0">
              <dt className="text-sm md:col-span-5">
                <strong>Bagaimana cara melakukan top up?</strong>
              </dt>
              <dd className="text-sm md:pl-0 md:col-span-7">
                Ikuti panduan di atas untuk melakukan top up di Gasskeuntopup.
              </dd>
            </div>
            <div className="py-2 space-y-2 md:grid md:grid-cols-12 md:gap-8 md:space-y-0">
              <dt className="text-sm md:col-span-5">
                <strong>Metode pembayaran apa saja yang tersedia?</strong>
              </dt>
              <dd className="text-sm md:pl-0 md:col-span-7">
                Kami menerima berbagai metode pembayaran, termasuk transfer
                bank, e-wallet, dan lain-lain.
              </dd>
            </div>
            <div className="py-2 space-y-2 md:grid md:grid-cols-12 md:gap-8 md:space-y-0">
              <dt className="text-sm md:col-span-5">
                <strong>Berapa lama proses top up?</strong>
              </dt>
              <dd className="text-sm md:pl-0 md:col-span-7">
                Proses top up biasanya instan setelah pembayaran berhasil. jika
                pesananmu tidak muncul dalam 2 jam kamu bisa menghubungi
                whatsapp kami dan menyampaikan keluhan anda
              </dd>
            </div>
            <div className="py-2 space-y-2 md:grid md:grid-cols-12 md:gap-8 md:space-y-0">
              <dt className="text-sm md:col-span-5">
                <strong>Apakah ada garansi uang kembali?</strong>
              </dt>
              <dd className="text-sm md:pl-0 md:col-span-7">
                Ya, kami memberikan garansi uang kembali jika terjadi masalah
                pada transaksi Anda.
              </dd>
            </div>
            <div className="py-2 space-y-2 md:grid md:grid-cols-12 md:gap-8 md:space-y-0">
              <dt className="text-sm md:col-span-5">
                <strong>Bagaimana cara menghubungi layanan pelanggan?</strong>
              </dt>
              <dd className="text-sm md:pl-0 md:col-span-7">
                Anda bisa menghubungi kami melalui whatsapp kami di{" "}
                <u>028112065672</u>
              </dd>
            </div>
          </dl>
        </section>
        {!show ? (
          <div className="hider_gradient h-20 w-full bg-gradient-to-b from-transparent to-white absolute bottom-0 left-0" />
        ) : (
          <></>
        )}
      </Container>
      <div className="flex justify-center mt-6">
        <button
          className="text-primary-900"
          onClick={() => {
            setShowAbout((prev) => !prev);
          }}
        >
          {show ? "Sembuyikan" : "Baca Selengkapnya"}
        </button>
      </div>
    </section>
  );
}
