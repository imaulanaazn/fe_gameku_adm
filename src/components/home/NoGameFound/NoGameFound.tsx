import Container from "@/components/global/Container/Container";
import Image from "next/image";

const NoGameFound = () => {
  return (
    <section className="bg-primary-900 py-16 lg:py-24">
      <Container>
        <div className="flex gap-20 flex-col-reverse lg:flex-row items-center">
          <div className="left-side flex-1">
            <h1 className="font-bold text-white text-4xl lg:text-5xl">
              Gak nemuin yang kamu cari?
            </h1>
            <p className="mt-3 lg:mt4 text-white max-w-lg">
              Yuk segera hubungi kami dan beritahu kami tentang keluhan /
              saranmu kepada gasskeun top up agar kami bisa melayani pelanggan
              lebih baik lagi.
            </p>
            <button className="bg-white text-primary-900 mt-8 lg:text-sm rounded-md py-2 px-4 lg:py-3 lg:px-5 font-medium hover:bg-black hover:text-white">
              <a
                href="https://api.whatsapp.com/send?phone=628112065672"
                target="_blank"
              >
                Hubungi sekarang
              </a>
            </button>
          </div>
          <div className="hidden lg:block right-side flex-1">
            <Image
              src="/images/no_game_found.svg"
              width={400}
              height={400}
              alt="no game found"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NoGameFound;
