export const useGetTeamImage = (name: string) => {
  if (name.includes('키움')) {
    return '/src/assets/logos/logo_kiwoom.svg';
  }
};
