const languages = [
        "Python",
        "Java",
        "JavaScript",
        "C++",
        "Rust",
        "C",
        "HTML",
        "SQL",
        "C#",
        "Haskell",
        "Go",
        "Fortran",
        "Ruby",
        "Perl",
        "Pascal",
        "Scratch",
        "Cobol",
        "Lisp",
        "TypeScript",
        "Assembly"
    ];

export const getRandomLanguage = () => {
    const randomInt = Math.floor(Math.random() * languages.length);
    return languages[randomInt];
}