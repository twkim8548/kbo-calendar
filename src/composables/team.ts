import heroesLogo from '@/assets/logos/logo_heroes.png';
import lionsLogo from '@/assets/logos/logo_lions.png';
import twinsLogo from '@/assets/logos/logo_twins.png';
import wizLogo from '@/assets/logos/logo_wiz.png';
import landersLogo from '@/assets/logos/logo_landers.png';
import dinosLogo from '@/assets/logos/logo_dinos.png';
import bearsLogo from '@/assets/logos/logo_bears.png';
import tigersLogo from '@/assets/logos/logo_tigers.png';
import giantsLogo from '@/assets/logos/logo_giants.png';
import eagelsLogo from '@/assets/logos/logo_eagles.png';

export const useGetTeamImage = (id: number) => {
  switch (id) {
    case 1:
      return heroesLogo;
    case 2:
      return lionsLogo;
    case 3:
      return twinsLogo;
    case 4:
      return wizLogo;
    case 5:
      return landersLogo;
    case 6:
      return dinosLogo;
    case 7:
      return bearsLogo;
    case 8:
      return tigersLogo;
    case 9:
      return giantsLogo;
    case 10:
      return eagelsLogo;
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

export const useGetTeam = (name?: string) => {
  const teams = [
    {
      nameEn: 'heroes',
      nameKo: '키움 히어로즈',
    },
    {
      nameEn: 'lions',
      nameKo: '삼성 라이온즈',
    },
    {
      nameEn: 'twins',
      nameKo: '엘지 트윈스',
    },
    {
      nameEn: 'wiz',
      nameKo: 'KT 위즈',
    },
    {
      nameEn: 'landers',
      nameKo: 'SSG 랜더스',
    },
    {
      nameEn: 'dinos',
      nameKo: 'NC 다이노스',
    },
    {
      nameEn: 'bears',
      nameKo: '두산 베어스',
    },
    {
      nameEn: 'tigers',
      nameKo: '기아 타이거즈',
    },
    {
      nameEn: 'giants',
      nameKo: '롯데 자이언츠',
    },
    {
      nameEn: 'eagles',
      nameKo: '한화 이글스',
    },
  ];
  if (name) {
    return teams.find(it => it.nameKo === name || it.nameEn === name)
  }
  return teams;
};
