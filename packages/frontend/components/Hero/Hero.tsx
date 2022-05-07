const Hero = () => {
  return (
    <div className="relative">
      <div className="w-full overflow-hidden">
        <div className="flex flex-col items-center mx-auto">
          <img className="w-full" src="/assets/img/MetaverStake_top_title.png" />
          <p className="text-black text-xs absolute bottom-10 marimo-tracking-hero">STAKING FOR SOCIAL GOOD PROJECTS IN METAVERSE</p>
        </div>
        <div className="bg-marimo-4 h-3" />
        <div className="bg-marimo-3 h-6" />
      </div>
    </div>
  );
};

export default Hero;
