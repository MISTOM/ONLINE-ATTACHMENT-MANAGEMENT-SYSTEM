-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2021 at 02:32 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oams`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_year`
--

CREATE TABLE `academic_year` (
  `academic_year_id` int(11) NOT NULL,
  `academic_year` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `academic_year`
--

INSERT INTO `academic_year` (`academic_year_id`, `academic_year`, `code`, `is_active`) VALUES
(1, '2017-2018', 'Y78', 1),
(2, '2018-2019', 'Y89', 1),
(3, '2019-2020', 'Y90', 1),
(4, '2020-2021', 'Y201', 1);

-- --------------------------------------------------------

--
-- Table structure for table `activities_table`
--

CREATE TABLE `activities_table` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_logs` varchar(255) NOT NULL,
  `supervisors_logs` varchar(255) DEFAULT NULL,
  `log_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `activities_table`
--

INSERT INTO `activities_table` (`log_id`, `user_id`, `student_logs`, `supervisors_logs`, `log_date`) VALUES
(23, 6, 'todays desctiption this ti sthe testsalad salad salad salad salad salsa salsa salsa salsa the quick brown fox jumped over the lazy slepy dog', 'dsafasdcds', '2021-03-02'),
(24, 3, 'this is the og for hillary keen for today 02/03/2021\r\nthe skills i learnt are this and that', NULL, '2021-03-02'),
(25, 6, 'today i learnt that the quick brown fox jumps over the lazy sleepy dog.\r\nin addition, Javascript is very interesting.', 'example of supervisor logs', '2021-03-03'),
(26, 3, 'Object Oriented Programming languages include Java Python C++, C# ETC\r\nThese are high level\r\n', 'GREAT, keep up', '2021-03-03'),
(27, 3, 'today i learnt that The main difference between object-oriented analysis and other forms of analysis is that in object-oriented approach, requirements are organized around objects, which integrate both data and functions. They are modelled after real-worl', 'are you sure?!', '2021-03-04'),
(28, 6, 'The primary tasks in object-oriented analysis (OOA) are −\r\n\r\nIdentifying objects\r\nOrganizing the objects by creating object model diagram\r\nDefining the internals of the objects, or object attributes\r\nDefining the behavior of the objects, i.e., object acti', NULL, '2021-03-04'),
(29, 9, 'log leo hii log', 'good work abel', '2021-03-04');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `department_code` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `school_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `department_code`, `is_active`, `school_id`) VALUES
(1, 'Information and Telecommunication Engineering', 'ITE', 1, 4),
(2, 'Mechanical Engineering', 'DME', 1, 4),
(3, 'MECHATRONIC Engineering', 'DMCH', 1, 4),
(4, 'Electrical and Elecrtonic Engineering', 'EEE', 1, 4),
(5, 'Acturial Science', 'ACS', 1, 1),
(6, 'Applied Mathematics', 'AMS', 0, 1),
(7, 'Information Technology', 'IT', 1, 1),
(8, 'Computing', 'COMP', 1, 1),
(9, 'Food Science and Technology', 'FST', 1, 2),
(10, 'Landscape and and Environmental Science', 'LESC', 1, 2),
(11, 'Agricultural and Food Economics', 'AFE', 0, 2),
(12, 'Animal Sciences', 'ALS', 0, 2),
(13, 'Business Administration', 'BADM', 1, 3),
(14, 'Media Technology and Applied communication', 'MTAC', 1, 3),
(15, 'Center in Foreign Langueges and Linguistics', 'FLL', 0, 3),
(16, 'Procurements and Logistics', 'FLL', 1, 3),
(17, 'General Nursing', 'GN', 1, 5),
(18, 'Clinical Medicine', 'CM', 1, 5),
(19, 'Surgery', 'SRG', 1, 5),
(20, 'Pharmaceutics', 'PHC', 1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `institution_info`
--

CREATE TABLE `institution_info` (
  `institution_id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `work_position` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) NOT NULL,
  `additional_info` varchar(255) DEFAULT NULL,
  `approved` tinyint(1) NOT NULL,
  `rejected` tinyint(1) NOT NULL,
  `letter_file` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `institution_info`
--

INSERT INTO `institution_info` (`institution_id`, `student_id`, `institution_name`, `location`, `from_date`, `to_date`, `work_position`, `website`, `email_address`, `additional_info`, `approved`, `rejected`, `letter_file`) VALUES
(26, '3', 's', 'd', '2021-03-02', '2021-04-02', 'd', 'web.com', 'std@d', 'optional text', 1, 0, 'public\\uploads\\Hillary_reg-no-003_1614672141203.pdf'),
(27, '6', 'a', 's', '2021-03-01', '2021-04-02', 's', 'sdds', 'ee@gg.com', 'option', 1, 0, 'public\\uploads\\Sylvia_reg-no-006_1614674930770.pdf'),
(28, '9', 'this institution', 'NAIROBI', '2021-03-04', '2021-04-01', 'javascript programer', 'meruclinicsite.org', 'kigardetom2001@gmail.com', 'optional text of this institution', 1, 0, 'public\\uploads\\Abel_reg-no-009_1614862252883.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `institution_supervisor`
--

CREATE TABLE `institution_supervisor` (
  `institution_supervisor_id` int(11) NOT NULL,
  `supv_first_name` varchar(255) NOT NULL,
  `supv_last_name` varchar(255) NOT NULL,
  `supv_email` varchar(255) NOT NULL,
  `supv_contact` int(11) NOT NULL,
  `institution_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `institution_supervisor`
--

INSERT INTO `institution_supervisor` (`institution_supervisor_id`, `supv_first_name`, `supv_last_name`, `supv_email`, `supv_contact`, `institution_id`) VALUES
(25, 'ww', 'w', 'w.@ff', 212, '26'),
(26, 'Sheila', 'Mbao', 'email@gmail.com', 147845858, '27'),
(27, 'collins', 'munene', 'mell@gmail.com', 789858585, '28');

-- --------------------------------------------------------

--
-- Table structure for table `programme`
--

CREATE TABLE `programme` (
  `programme_id` int(11) NOT NULL,
  `programme_name` varchar(255) NOT NULL,
  `programme_code` varchar(255) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `programme`
--

INSERT INTO `programme` (`programme_id`, `programme_name`, `programme_code`, `department_id`) VALUES
(1, 'Diploma in Acturial Science', 'DAS', 5),
(2, 'Degree in Acturial Science', 'BAS', 5),
(3, 'Diploma in Applied Mathematics', 'DAM', 6),
(4, 'Degree in Applied Mathematics', 'BAM', 6),
(5, 'Diploma in Information Technology', 'DIT', 7),
(6, 'Degree in Information Technology', 'BIT', 7),
(7, 'Diploma in Computing', 'DCOMP', 8),
(8, 'Degree in Computing', 'BCOMP', 8),
(9, 'Diploma in Food and Science and Technology', 'DFST', 9),
(10, 'Degree in Food and Science and Technology', 'BFST', 9),
(11, 'Diploma in Landscape and Environmental Science', 'DFST', 10),
(12, 'Degree in Landscape and Environmental Science', 'BFST', 10),
(13, 'Diploma in Agricultural and Food Economics', 'DAFE', 11),
(14, 'Degree in Agricultural and Food Economics', 'BAFE', 11),
(15, 'Diploma in Animal Science', 'DASC', 12),
(16, 'Degree in Animal Science', 'BASC', 12),
(17, 'Diploma in Business Administration', 'DBA', 13),
(18, 'Degree in Business Administration', 'BBA', 13),
(19, 'Diploma in Media Technology and Applied Communication', 'DMCOMM', 14),
(20, 'Degree in Media Technology and Applied Communication', 'BMCOMM', 14),
(21, 'Diploma in Foreign Langueges and Linguistics', 'DFL', 15),
(22, 'Degree in Foreign Langueges and Linguistics', 'BFL', 15),
(23, 'Diploma in Procurement and Logistics', 'DPL', 16),
(24, 'Degree in Procurement and Logistics', 'BPL', 16),
(25, 'Diploma in General Nursing', 'DGNR', 17),
(26, 'Degree in General Nursing', 'BGNR', 17),
(27, 'Diploma in Clinical Medicine', 'DCMED', 18),
(28, 'Degree in Clinical Medicine', 'DCMED', 18),
(29, 'Diploma in Surgery', 'DIS', 19),
(30, 'Degree in Surgery', 'BIS', 19),
(31, 'Diploma in Pharmaceutics', 'DIP', 20),
(32, 'Degree in Pharmaceutics', 'BIP', 20),
(33, 'Diploma in Information and Telecommunication Engineering', 'DTENG', 1),
(34, 'Degree in Information and Telecommunication Engineering', 'BTENG', 1),
(35, 'Diploma in Mechanical Engineering', 'DMENG', 2),
(36, 'Degree in Mechanical Engineering', 'BMENG', 2),
(37, 'Diploma in Mechatroic Engineering', 'DMENG', 3),
(38, 'Degree in Mechatroic Engineering', 'BMENG', 3),
(39, 'Diploma in Electrical and Electronic Engineering', 'DEENG', 4),
(40, 'Degree in Electrical and Electronic Engineering', 'BEENG', 4);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `role_code` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `role_code`, `is_active`) VALUES
(1, 'SYSTEM ADMIN', 'ADMIN', 1),
(2, 'INSTITUTION SUPERVISOR', 'ISUP', 1),
(3, 'ATTACHEE/INTERN', 'ATT', 1);

-- --------------------------------------------------------

--
-- Table structure for table `school`
--

CREATE TABLE `school` (
  `school_id` int(11) NOT NULL,
  `school_name` varchar(255) NOT NULL,
  `school_code` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `school`
--

INSERT INTO `school` (`school_id`, `school_name`, `school_code`, `is_active`) VALUES
(1, 'APPLIED SCIENCES AND MATH', 'SCI', 1),
(2, 'AGRICULTURAL AND NATURAL RECOUSES', 'AGRI', 1),
(3, 'HUMAN RESOURCE AND DEVELOPMENT', 'HR', 0),
(4, 'ENGINEERING AND TECHNOLOGY', 'ENG', 1),
(5, 'HEALTH SCIENCES', 'HS', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `other_name` varchar(255) DEFAULT NULL,
  `role_id` int(255) NOT NULL,
  `academic_year_id` int(255) DEFAULT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `other_name`, `role_id`, `academic_year_id`, `registration_number`, `username`, `password`) VALUES
(1, 'Cardinal', 'Tom B', 'Erichsen', 1, NULL, NULL, 'cardinal', 'cardinal123'),
(2, 'Jamen', 'Erick', 'Taurine', 1, NULL, NULL, 'erick', 'erick123'),
(3, 'Hillary', 'Keen', 'Cite', 3, 3, 'reg-no-003', 'keen', 'keen123'),
(4, 'Selina', 'Nursa', 'Mirara', 3, 4, 'reg-no-004', 'nursa', 'nursa123'),
(5, 'Patrick', 'Munene', 'Odinga', 3, 1, 'reg-no-005', 'odinga', 'odinga123'),
(6, 'Sylvia', 'Linda', 'Kiragu', 3, 2, 'reg-no-006', 'kiragu', 'kiragu123'),
(7, 'Salah', 'Loice', 'Kihara', 3, 1, 'reg-no-007', 'loice', 'loice123'),
(8, 'Shaq', 'Luke', 'Kiambere', 3, 2, 'reg-no-008', 'luke', 'luke123'),
(9, 'Abel', 'Liland', 'Vision', 3, 3, 'reg-no-009', 'abel', 'abel123'),
(10, 'Abby', 'Lenny', 'Raquell', 3, 1, 'reg-no-010', 'lenny', 'lenny123'),
(11, 'Alice', 'Kibanja', 'Maragua', 3, 2, 'reg-no-011', 'alice', 'alice123'),
(12, 'Sumaya', 'Atiamuga', 'Ngana', 3, 2, 'reg-no-012', 'sumaya', 'sumaya123'),
(21, 'Sheila', 'Mbao', NULL, 2, NULL, '26', 'Sheila', 'Sheila-Mbao123'),
(22, 'ww', 'w', NULL, 2, NULL, '25', 'ww', 'ww-w123'),
(23, 'collins', 'munene', NULL, 2, NULL, '27', 'collins', 'collins-munene123');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `user_profile_id` int(11) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `programme_id` int(11) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `phone_number` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `next_of_kin_name` varchar(255) DEFAULT NULL,
  `next_of_kin_contact` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`user_profile_id`, `date_of_birth`, `user_id`, `programme_id`, `gender`, `phone_number`, `address`, `next_of_kin_name`, `next_of_kin_contact`, `user_email`) VALUES
(1, '2001-01-01', 1, NULL, 'male', 798765432, '123Rongai', 'Kimani', '0774185296', ''),
(2, '2021-02-17', 2, NULL, 'male', 798711432, '234Nairoi', 'Kariuki', '0774225296', ''),
(3, '1999-03-20', 3, 1, 'female', 798001432, '234Kiserian', 'Karemi', '0704221196', 'keenh@gmail.com'),
(4, '1999-03-05', 4, 2, 'Female', 789858578, '456Kisumu', 'Michael', '0789685685', 'nurasel@gmail.com'),
(5, '0000-00-00', 5, 7, 'male', 715456568, '111Nairobi', 'Muringi', '07854633258', 'patrick@gmailcom'),
(6, '2000-10-15', 6, 15, 'Female', 789546132, '456Mandera', 'Paul', '0745858468', 'lindas@gmail.com'),
(7, '2001-10-21', 7, 10, 'Male', 784346132, '455Lokichogio', 'Silas', '0732228468', 'kiharaloice@gmail.com'),
(8, '1991-10-21', 8, 19, 'male', 784346122, '123Mombasa', 'Kipkirui', '0732266468', 'shaqlike@gmail.com'),
(9, '1997-01-30', 9, 20, 'male', 784347622, '665Kiambu', 'Jane', '0732123468', 'abelo@gmail.com'),
(10, '1997-01-10', 10, 21, 'Female', 784323422, '555Maragua', 'Chepkemboi', '0711255568', 'lennyabby@gmail.com'),
(11, '1997-11-10', 11, 19, 'Female', 783323422, '900Mandera', 'Kahuru', '0719000568', 'kibanjaalice@gmail.com'),
(12, '2001-11-19', 12, 18, 'Female', 778900001, '876Jamuhuri', 'Mohammed', '0719322568', 'atiamugasumsum@gmail.com'),
(19, NULL, 21, NULL, NULL, 147845858, NULL, NULL, NULL, 'email@gmail.com'),
(20, NULL, 22, NULL, NULL, 212, NULL, NULL, NULL, 'w.@ff'),
(21, NULL, 23, NULL, NULL, 789858585, NULL, NULL, NULL, 'mell@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_year`
--
ALTER TABLE `academic_year`
  ADD PRIMARY KEY (`academic_year_id`);

--
-- Indexes for table `activities_table`
--
ALTER TABLE `activities_table`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD KEY `school_id` (`school_id`) USING BTREE;

--
-- Indexes for table `institution_info`
--
ALTER TABLE `institution_info`
  ADD PRIMARY KEY (`institution_id`);

--
-- Indexes for table `institution_supervisor`
--
ALTER TABLE `institution_supervisor`
  ADD PRIMARY KEY (`institution_supervisor_id`);

--
-- Indexes for table `programme`
--
ALTER TABLE `programme`
  ADD PRIMARY KEY (`programme_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `school`
--
ALTER TABLE `school`
  ADD PRIMARY KEY (`school_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `registration_number` (`registration_number`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_profile_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_year`
--
ALTER TABLE `academic_year`
  MODIFY `academic_year_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `activities_table`
--
ALTER TABLE `activities_table`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `institution_info`
--
ALTER TABLE `institution_info`
  MODIFY `institution_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `institution_supervisor`
--
ALTER TABLE `institution_supervisor`
  MODIFY `institution_supervisor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `programme`
--
ALTER TABLE `programme`
  MODIFY `programme_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `school`
--
ALTER TABLE `school`
  MODIFY `school_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `user_profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
