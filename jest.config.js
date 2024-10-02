module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  setupFiles: ['<rootDir>/tests/setup.js'], // Add this line to include the setup file
  testEnvironment: "jsdom",
  transform: {
    //"^.+\\.(ts|tsx)$": [      "ts-jest",      {                babel: true,        tsConfig: "tsconfig.json",      }    ],
    "^.+\\.vue$": "@vue/vue3-jest",
   "^.+\\.ts$": "ts-jest",
  //  "^.+\\.js$": "babel-jest",
	'^.+\\.(js|jsx|tsx)$': 'babel-jest', // 使用 babel-jest 转换 JS 文件
    //"^.+\\.js$": "babel-jest",
	'^.+\\.mjs$': 'babel-jest',
  },
  transformIgnorePatterns: [
	//"<rootDir>/node_modules/(?!(vuetify)/)",
    "<rootDir>/node_modules/(?!(.*\\.mjs)|date-fns|vuetify)",
	
    
  ],
  // 允许使用 ES 模块
  extensionsToTreatAsEsm: [".ts"],
  //testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  moduleFileExtensions: ['js', 'json', 'vue','ts'],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
