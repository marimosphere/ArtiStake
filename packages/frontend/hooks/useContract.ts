import { useMemo } from "react";

import { getArtistakeContract, getTipContract, getJpycContract } from "../lib/web3";
import useActiveWeb3React from "./useActiveWeb3";

export const useArtiStake = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getArtistakeContract(library.getSigner()), [library]);
};

export const useTip = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getTipContract(library.getSigner()), [library]);
};

export const useJpyc = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getJpycContract(library.getSigner()), [library]);
};

export const useUsdc = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getJpycContract(library.getSigner()), [library]);
};
