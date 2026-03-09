export const MOLECULES = {
    ch4: {
        name: '메테인',
        formula: 'CH₄',
        atoms: { C: 1, H: 4 },
        symbolStr: 'C H H H H',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="22" fill="#555" stroke="#333" stroke-width="1" />
                <text x="50" y="58" text-anchor="middle" fill="black" font-size="20" font-weight="bold" pointer-events="none">C</text>
                <circle cx="50" cy="22" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="50" y="28" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="50" cy="78" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="50" y="84" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="22" cy="50" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="22" y="56" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="78" cy="50" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="78" y="56" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
              </svg>`
    },
    o2: {
        name: '산소',
        formula: 'O₂',
        atoms: { O: 2 },
        symbolStr: 'O O',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="33" cy="50" r="22" fill="#ff4d4d" stroke="#444" stroke-width="1" />
                <text x="33" y="58" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">O</text>
                <circle cx="67" cy="50" r="22" fill="#ff4d4d" stroke="#444" stroke-width="1" />
                <text x="67" y="58" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">O</text>
              </svg>`
    },
    co2: {
        name: '이산화 탄소',
        formula: 'CO₂',
        atoms: { C: 1, O: 2 },
        symbolStr: 'C O O',
        svg: `<svg width="70" height="50" viewBox="0 0 120 100">
                <circle cx="28" cy="50" r="20" fill="#ff4d4d" stroke="#444" stroke-width="1" />
                <text x="28" y="57" text-anchor="middle" fill="black" font-size="16" font-weight="bold" pointer-events="none">O</text>
                <circle cx="60" cy="50" r="22" fill="#555" stroke="#333" stroke-width="1" />
                <text x="60" y="58" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">C</text>
                <circle cx="92" cy="50" r="20" fill="#ff4d4d" stroke="#444" stroke-width="1" />
                <text x="92" y="57" text-anchor="middle" fill="black" font-size="16" font-weight="bold" pointer-events="none">O</text>
              </svg>`
    },
    h2o: {
        name: '물',
        formula: 'H₂O',
        atoms: { H: 2, O: 1 },
        symbolStr: 'H H O',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="50" cy="40" r="22" fill="#ff4d4d" stroke="#444" stroke-width="1" />
                <text x="50" y="48" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">O</text>
                <circle cx="32" cy="65" r="16" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="32" y="71" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="68" cy="65" r="16" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="68" y="71" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
              </svg>`
    },
    cu: {
        name: '구리',
        formula: 'Cu',
        atoms: { Cu: 1 },
        symbolStr: 'Cu',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="22" fill="#cd7f32" stroke="#444" stroke-width="1" />
                <text x="50" y="58" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">Cu</text>
              </svg>`
    },
    cuo: {
        name: '산화 구리(II)',
        formula: 'CuO',
        atoms: { Cu: 1, O: 1 },
        symbolStr: 'Cu O',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="35" cy="50" r="22" fill="#cd7f32" stroke="#444" stroke-width="1" />
                <text x="35" y="58" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">Cu</text>
                <circle cx="65" cy="50" r="20" fill="#333" stroke="#000" stroke-width="1" />
                <text x="65" y="58" text-anchor="middle" fill="white" font-size="18" font-weight="bold" pointer-events="none">O</text>
              </svg>`
    },
    h2: {
        name: '수소',
        formula: 'H₂',
        atoms: { H: 2 },
        symbolStr: 'H H',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="35" cy="50" r="16" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="35" y="56" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="65" cy="50" r="16" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="65" y="56" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
              </svg>`
    },
    nh3: {
        name: '암모니아',
        formula: 'NH₃',
        atoms: { N: 1, H: 3 },
        symbolStr: 'N H H H',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="50" cy="45" r="22" fill="#3b82f6" stroke="#444" stroke-width="1" />
                <text x="50" y="53" text-anchor="middle" fill="white" font-size="18" font-weight="bold" pointer-events="none">N</text>
                <circle cx="30" cy="68" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="30" y="74" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="50" cy="78" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="50" y="84" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="70" cy="68" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="70" y="74" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
              </svg>`
    },
    hcl: {
        name: '염화 수소',
        formula: 'HCl',
        atoms: { H: 1, Cl: 1 },
        symbolStr: 'H Cl',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="35" cy="50" r="14" fill="#a0c4ff" stroke="#444" stroke-width="1" />
                <text x="35" y="56" text-anchor="middle" fill="black" font-size="14" font-weight="bold" pointer-events="none">H</text>
                <circle cx="65" cy="50" r="22" fill="#22c55e" stroke="#444" stroke-width="1" />
                <text x="65" y="58" text-anchor="middle" fill="white" font-size="18" font-weight="bold" pointer-events="none">Cl</text>
              </svg>`
    },
    mg: {
        name: '마그네슘',
        formula: 'Mg',
        atoms: { Mg: 1 },
        symbolStr: 'Mg',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="22" fill="#a1a1aa" stroke="#444" stroke-width="1" />
                <text x="50" y="58" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">Mg</text>
              </svg>`
    },
    mgcl2: {
        name: '염화 마그네슘',
        formula: 'MgCl₂',
        atoms: { Mg: 1, Cl: 2 },
        symbolStr: 'Cl Mg Cl',
        svg: `<svg width="70" height="50" viewBox="0 0 120 100">
                <circle cx="28" cy="50" r="20" fill="#22c55e" stroke="#444" stroke-width="1" />
                <text x="28" y="57" text-anchor="middle" fill="white" font-size="16" font-weight="bold" pointer-events="none">Cl</text>
                <circle cx="60" cy="50" r="22" fill="#a1a1aa" stroke="#333" stroke-width="1" />
                <text x="60" y="58" text-anchor="middle" fill="black" font-size="18" font-weight="bold" pointer-events="none">Mg</text>
                <circle cx="92" cy="50" r="20" fill="#22c55e" stroke="#444" stroke-width="1" />
                <text x="92" y="57" text-anchor="middle" fill="white" font-size="16" font-weight="bold" pointer-events="none">Cl</text>
              </svg>`
    },
    n2: {
        name: '질소',
        formula: 'N₂',
        atoms: { N: 2 },
        symbolStr: 'N N',
        svg: `<svg width="50" height="50" viewBox="0 0 100 100">
                <circle cx="33" cy="50" r="22" fill="#3b82f6" stroke="#444" stroke-width="1" />
                <text x="33" y="58" text-anchor="middle" fill="white" font-size="18" font-weight="bold" pointer-events="none">N</text>
                <circle cx="67" cy="50" r="22" fill="#3b82f6" stroke="#444" stroke-width="1" />
                <text x="67" y="58" text-anchor="middle" fill="white" font-size="18" font-weight="bold" pointer-events="none">N</text>
              </svg>`
    }
};

export const REACTIONS = {
    methane: {
        title: '메테인의 연소',
        desc: '"메테인 가스는 산소와 만나 연소하면서 물과 이산화탄소로 화학반응한다."',
        reactants: ['ch4', 'o2'],
        products: ['co2', 'h2o'],
        balanceAtoms: ['C', 'H', 'O']
    },
    copper: {
        title: '구리의 연소',
        desc: '"붉은색 구리판을 공기 중에서 가열하면 검은색의 산화 구리(II)로 변한다."',
        reactants: ['cu', 'o2'],
        products: ['cuo'],
        balanceAtoms: ['Cu', 'O']
    },
    hydrogen: {
        title: '수소의 연소',
        desc: '"수소 가스가 공기 중의 산소와 반응하여 격렬하게 타며 물을 생성한다."',
        reactants: ['h2', 'o2'],
        products: ['h2o'],
        balanceAtoms: ['H', 'O']
    },
    magnesium_hcl: {
        title: '염산과 마그네슘의 반응',
        desc: '"염산과 마그네슘이 반응하여 수소 기체가 발생하고 염화 마그네슘이 생성된다."',
        reactants: ['hcl', 'mg'],
        products: ['mgcl2', 'h2'],
        balanceAtoms: ['H', 'Cl', 'Mg']
    },
    ammonia_synthesis: {
        title: '암모니아 생성',
        desc: '"질소와 수소를 화학 반응 시켜 암모니아를 생성한다."',
        reactants: ['n2', 'h2'],
        products: ['nh3'],
        balanceAtoms: ['N', 'H']
    }
};
