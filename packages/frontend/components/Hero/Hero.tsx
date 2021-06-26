const Hero = () => {
  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col items-center mx-auto bg-marimo-1 p-4 pb-6">
          <p className="text-white text-xs tracking-widest marimo-tracking-hero">STAKING FOR CRYPTO ARTISTS</p>
          <div className="p-4">
            <img className="h-80" src="/assets/img/hero.png" />
          </div>
          <p className="text-white text-4xl marimo-tracking-hero">ArtiStake</p>
        </div>
        <div className="bg-marimo-4 h-6" />
        <div className="bg-marimo-3 h-6" />
      </div>
    </div>
  );
};

export default Hero;
