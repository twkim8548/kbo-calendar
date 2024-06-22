export const useGetTeamImage = (id: number) => {
  switch (id) {
    case 1:
      return '@/assets/logos/logo_heroes.png';
    case 2:
      return '@/assets/logos/logo_lions.png';
    case 3:
      return '@/assets/logos/logo_twins.png';
    case 4:
      return '@/assets/logos/logo_wiz.png';
    case 5:
      return '@/assets/logos/logo_landers.png';
    case 6:
      return '@/assets/logos/logo_dinos.png';
    case 7:
      return '@/assets/logos/logo_bears.png';
    case 8:
      return '@/assets/logos/logo_tigers.png';
    case 9:
      return '@/assets/logos/logo_giants.png';
    case 10:
      return '@/assets/logos/logo_eagels.png';
  }
};

export const useGetTeamNaverInitial = (id: number) => {
  switch (id) {
    case 1:
      return 'WO';
    case 2:
      return 'SS';
    case 3:
      return 'LG';
    case 4:
      return 'KT';
    case 5:
      return 'SK';
    case 6:
      return 'NC';
    case 7:
      return 'OB';
    case 8:
      return 'HT';
    case 9:
      return 'LT';
    case 10:
      return 'HH';
  }
};

export const useGetTeamInitial = (id: number) => {
  switch (id) {
    case 1:
      return '큠';
    case 2:
      return '삼';
    case 3:
      return '엘';
    case 4:
      return '킅';
    case 5:
      return '쓱';
    case 6:
      return '엔';
    case 7:
      return '두';
    case 8:
      return '갸';
    case 9:
      return '롯';
    case 10:
      return '한';
  }
};
