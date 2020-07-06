-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2020 at 09:03 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE md_db;
USE md_db;

--
-- Database: `md_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `user_id`, `name`, `content`) VALUES
(80, 3, 'Documentation', '# Single-file JS Markdown editor\n\nИмена: Иван Лучев\n\nФН: 62135\n\nПрограма: бакалавър, (СИ)\n\nКурс: 3\n\nТема: 1.4, Създаване и генериране на документация за групов проект - в md/html/pdf формат\n\nДата: 2020.07.06\n\nПредмет: w14prj＿SI＿final\n\nмейл: luchevz@gmail.com\n\nпреподавател: доц. д-р Милен Петров\n\n## Условие\n\nСъздаване на документация за проект - в md формат. Или още: markdown редактор, който показва как ще изглежда рендерираният markdown в реално време и позволява на потребителите да съхраняват документите си за редакция или преглед по-късно.\n\n## Въведение\n\nПриложението предоставя на потребителя редактор на markdown, в който може да пише markdown текст и да вижда как този текст ще се форматира в реално време.\n\nОсновните функционалности включват:\n\n- Създаване на потребителски профил в системата\n\n- Създаване на нов markdown документ, който е достъпен само от текущия потребител\n\n- Записване/редактиране на текст в документ на потребителя\n\n- Записване на промените в документа в базата данни\n\n- Сваляне на документ като markdown файл\n\n- Преименуване на документ\n\n- Изтриване на документ\n\n- В редактора може да се включва/изключва настройката за скриване на форматиращите markdown елементи\n\n- В редактора може да се включва/изключва автоматичното компилиране на документа и показване на резултата в реално време\n\n## Използвани технологии\n\nПриложението използва MySQL база данни, PHP за сървърната част и HTML + CSS + Javascript за потребителската част.\n\nРедакторът е написан на TypeScript и компилиран до Javascript. За компилацията до Javascript е използван стандартния компилатор на TypeScript и след което [скрипт](https://github.com/luchev/markdown-editor/blob/master/compileJs.sh), който да изчисти модулите, експортването и импортването, за да се получи 1 Javascript файл с цялата логика.\n\nЗа показване на съобщения на потребителя е използвана библиотеката [iziToast][iziToast], която предоставя различни видове toast-notifications.\n\nЗа иконите са използвани [Feather Icons].\n\n## Инсталация и настройки\n\nЗа инсталацията са необходими 2 неща:\n\n- Да се инициализира базата данни (файлът за импортиране на базата данни е *sql/mysql.sql*). Този файл може директно да се импортира през phpMyAdmin.\n\n- Да се конфигурират данните за базата данни, които се намират във файла *website/php/lib/dbauth.php*.\n\n- Да се копира уебсайта в директория на уеб сървъра (apache).\n\n## Кратко ръководство на потребителя\n\n#### Началната страница с демо редактора\n\n![][demo home page]\n\n#### Формата за регистрация/логин, която се достъпва чрез бутона *Sign in* в горният десен ъгъл\n\n![][demo register]\n\n#### Как да достъпим редактора, когато сме се логнали в системата\n\n![][access the editor]\n\n#### Инструкции за редактора\n\n![][editor info]\n\n## Примерен потребител с вече създадени документи е:\n\n- username: user@gmail.com\n\n- password: pass\n\nВ профила на този потребител може да се разгледа документацията на този проект (текущият документ) както и демо документа, който се вижда на началната страница на уеб сайта.\n\nАко потребителя желае едиствено да види как работи редактора - има демо версия (без запаметяване на съдържанието или създаване на други файлове) на началната страница на уеб сайта.\n\nВ противен случай, всеки може да се регистрира с желано име и парола и да изпробва цялата функционалност на приложението.\n\n## Описание на програмния код\n\n### Редактор\n\nРедакторът на кодът е напълно модулярен, както може да видим от следната диаграма на класовете:\n\n![][class diagram]\n\nРедакторът се състои от 2 елемента:\n\n- Тема (за конфигурация на изгледа)\n\n- Компилатор/Рендер (за форматиране на текста, в нашият случай има само един такъв - компилатор на markdown)Приноси на студента, ограничения и възможности за бъдещо разширение\n\n## Приноси на студента, ограничения и възможности за бъдещо разширение\n\nОсновните ограничения идват от използването на използването на DOM API-я. Въпреки че предоставя много възможности за контролиране на съдържанието на уеб страницата, има много вградени поведения, които водят до нежелано поведение на редактора на код и трябва ръчно всяко едно такова поведение да се коригира.\n\nРедакторът е напълно модулен и може да се разшири чрез други компилатори, които може да не са за markdown, а друг тип маркиращ език. Възможно е да се имплементират нови теми за редактора, тъй като редакторът приема списък от CSS правила и ги инжектира в страницата динамично. Настройките на редактора също се подават като аргумент и могат да бъдат променяни в зависимост от нуждите на потребителите или това какъв компилатор се използва.\n\n## Използвани източници\n\n[Feather Icons]: https://github.com/feathericons/feather \"Feather Icons\"\n\n[iziToast]: https://github.com/marcelodolza/iziToast \"Elegant, responsive, flexible and lightweight notification plugin with no dependencies. by marcelodolza\"\n\n## Изображения\n\n[demo home page]: https://i.imgur.com/SfZfegH.png\n\n[demo register]: https://i.imgur.com/Ap40L9z.png\n\n[access the editor]: https://i.imgur.com/DFgnu1c.png\n\n[editor info]: https://i.imgur.com/NhS9yGI.png\n\n[class diagram]: https://i.imgur.com/CTNwTLh.png\n\n---\n\nПредал (подпис): ………………………….\n\n/62135, Иван Лучев, СИ, 2ра група/\n\nПриел (подпис): ………………………….\n\n/доц. Милен Петров/\n\n'),
(82, 3, 'Demo file', 'Try typing in some markdown\n\nLike **this bold text** or some _italics_ or ***BOTH?***     \n\n# Here\'s a title using a \"# \" as a prefix\n\n> If you want to see all the syntax markers open the settings to the left and uncheck `Hide Syntax` \n\n---\n\nOr if you want you can disable the preview at all by unchecking the \'Dynamic render\' option\n\n---\n\n[cat]: https://cresentiuz.files.wordpress.com/2013/10/cat-10.png?w=585\n\n---\n\nTry changing the url above to:\n\n#### https://easysunday.com/blog/wp-content/uploads/2017/11/cat.jpg\n\n![][cat]\n\n'),
(83, 5, 'Documentation', '# Single-file JS Markdown editor\r\n\nИмена: Иван Лучев\r\n\nФН: 62135\r\n\nПрограма: бакалавър, (СИ)\r\n\nКурс: 3\r\n\nТема: 1.4, Създаване и генериране на документация за групов проект - в md/html/pdf формат\r\n\nДата: 2020.07.06\r\n\nПредмет: w14prj＿SI＿final\r\n\nмейл: luchevz@gmail.com\r\n\nпреподавател: доц. д-р Милен Петров\r\n\n## Условие\r\n\nСъздаване на документация за проект - в md формат. Или още: markdown редактор, който показва как ще изглежда рендерираният markdown в реално време и позволява на потребителите да съхраняват документите си за редакция или преглед по-късно.\r\n\n## Въведение\r\n\nПриложението предоставя на потребителя редактор на markdown, в който може да пише markdown текст и да вижда как този текст ще се форматира в реално време.\r\n\nОсновните функционалности включват:\r\n\n- Създаване на потребителски профил в системата\r\n\n- Създаване на нов markdown документ, който е достъпен само от текущия потребител\r\n\n- Записване/редактиране на текст в документ на потребителя\r\n\n- Записване на промените в документа в базата данни\r\n\n- Сваляне на документ като markdown файл\r\n\n- Преименуване на документ\r\n\n- Изтриване на документ\r\n\n- В редактора може да се включва/изключва настройката за скриване на форматиращите markdown елементи\r\n\n- В редактора може да се включва/изключва автоматичното компилиране на документа и показване на резултата в реално време\r\n\n## Използвани технологии\r\n\nПриложението използва MySQL база данни, PHP за сървърната част и HTML + CSS + Javascript за потребителската част.\r\n\nРедакторът е написан на TypeScript и компилиран до Javascript. За компилацията до Javascript е използван стандартния компилатор на TypeScript и след което [скрипт](https://github.com/luchev/markdown-editor/blob/master/compileJs.sh), който да изчисти модулите, експортването и импортването, за да се получи 1 Javascript файл с цялата логика.\r\n\nЗа показване на съобщения на потребителя е използвана библиотеката [iziToast][iziToast], която предоставя различни видове toast-notifications.\r\n\nЗа иконите са използвани [Feather Icons].\r\n\n## Инсталация и настройки\r\n\nЗа инсталацията са необходими 2 неща:\r\n\n- Да се инициализира базата данни (файлът за импортиране на базата данни е *sql/mysql.sql*). Този файл може директно да се импортира през phpMyAdmin.\r\n\n- Да се конфигурират данните за базата данни, които се намират във файла *website/php/lib/dbauth.php*.\r\n\n- Да се копира уебсайта в директория на уеб сървъра (apache).\r\n\n## Кратко ръководство на потребителя\r\n\n#### Началната страница с демо редактора\r\n\n![][demo home page]\r\n\n#### Формата за регистрация/логин, която се достъпва чрез бутона *Sign in* в горният десен ъгъл\r\n\n![][demo register]\r\n\n#### Как да достъпим редактора, когато сме се логнали в системата\r\n\n![][access the editor]\r\n\n#### Инструкции за редактора\r\n\n![][editor info]\r\n\n## Примерен потребител с вече създадени документи е:\r\n\n- username: user@gmail.com\r\n\n- password: pass\r\n\nВ профила на този потребител може да се разгледа документацията на този проект (текущият документ) както и демо документа, който се вижда на началната страница на уеб сайта.\r\n\nАко потребителя желае едиствено да види как работи редактора - има демо версия (без запаметяване на съдържанието или създаване на други файлове) на началната страница на уеб сайта.\r\n\nВ противен случай, всеки може да се регистрира с желано име и парола и да изпробва цялата функционалност на приложението.\r\n\n## Описание на програмния код\r\n\n### Редактор\r\n\nРедакторът на кодът е напълно модулярен, както може да видим от следната диаграма на класовете:\r\n\n![][class diagram]\r\n\nРедакторът се състои от 2 елемента:\r\n\n- Тема (за конфигурация на изгледа)\r\n\n- Компилатор/Рендер (за форматиране на текста, в нашият случай има само един такъв - компилатор на markdown)Приноси на студента, ограничения и възможности за бъдещо разширение\r\n\n## Приноси на студента, ограничения и възможности за бъдещо разширение\r\n\nОсновните ограничения идват от използването на използването на DOM API-я. Въпреки че предоставя много възможности за контролиране на съдържанието на уеб страницата, има много вградени поведения, които водят до нежелано поведение на редактора на код и трябва ръчно всяко едно такова поведение да се коригира.\r\n\nРедакторът е напълно модулен и може да се разшири чрез други компилатори, които може да не са за markdown, а друг тип маркиращ език. Възможно е да се имплементират нови теми за редактора, тъй като редакторът приема списък от CSS правила и ги инжектира в страницата динамично. Настройките на редактора също се подават като аргумент и могат да бъдат променяни в зависимост от нуждите на потребителите или това какъв компилатор се използва.\r\n\n## Използвани източници\r\n\n[Feather Icons]: https://github.com/feathericons/feather \"Feather Icons\"\n\n[iziToast]: https://github.com/marcelodolza/iziToast \"Elegant, responsive, flexible and lightweight notification plugin with no dependencies. by marcelodolza\"\n\n## Изображения\r\n\n[demo home page]: https://i.imgur.com/SfZfegH.png\n\n[demo register]: https://i.imgur.com/Ap40L9z.png\n\n[access the editor]: https://i.imgur.com/DFgnu1c.png\n\n[editor info]: https://i.imgur.com/NhS9yGI.png\n\n[class diagram]: https://i.imgur.com/CTNwTLh.png\n\n---\n\nПредал (подпис): ………………………….\r\n\n/62135, Иван Лучев, СИ, 2ра група/\r\n\nПриел (подпис): ………………………….\r\n\n/доц. Милен Петров/\r\n\n'),
(84, 5, 'Demo', 'Try typing in some markdown\n\nLike **this bold text** or some _italics_ or ***BOTH?***\n\n# Here\'s a title using a \"# \" as a prefix\n\n> If you want to see all the syntax markers open the settings to the left and uncheck `Hide Syntax`\n\n---\n\nOr if you want you can disable the preview at all by unchecking the \'Dynamic render\' option\n\n---\n\n[cat]: https://cresentiuz.files.wordpress.com/2013/10/cat-10.png?w=585\n\n---\n\nTry changing the url above to:\n\n#### https://easysunday.com/blog/wp-content/uploads/2017/11/cat.jpg\n\n![][cat]\n\n');

-- --------------------------------------------------------

--
-- Table structure for table `loggedin`
--

CREATE TABLE `loggedin` (
  `user_id` int(11) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `nickname`) VALUES
(3, '123@123', '$2y$10$g16sphc1CV1G/gpgftMEbujTnXFdgidhpwl6xbi9TPD7uPesATyly', NULL),
(5, 'user@mail.com', '$2y$10$09mlDZFvWzT6DpfItBRimeqp0WKZt8YGT3sAysbdomG61menzz82y', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loggedin`
--
ALTER TABLE `loggedin`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `nickname` (`nickname`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
