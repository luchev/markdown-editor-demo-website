<?php

require 'php/lib/dbauth.php';

/**
 * Database API
 */
class DB {
	/**
	 * $dbAuth contains the authentication tokens for connecting to the database
	 */
	private $dbAuth;
	/**
	 * DB is a singleton class, $instance is the only instance of it 
	 */
	private static $instance;
	
	/**
	 * Singleton constructor
	 */
	private function __construct() {
		$dbAuth = new DBAuth();
		$host = $dbAuth->host;
		$port = $dbAuth->port;
		$dbname = $dbAuth->dbname;
		$user = $dbAuth->user;
		$password = $dbAuth->password;
		
		if (!self::$instance) {
			$this->connection = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $password, 
				array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		}
	}

	/**
	 * Get the instance of the class
	 */
	public static function instance() {
		if (!self::$instance) {
			self::$instance = new DB();
		}
		return self::$instance;
	}

	/**
	 * Sign up a user given an email and password
	 */
	public function signup(string $email, string $password) {
		$password = password_hash($password, PASSWORD_DEFAULT);

		$sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$email, $password]);
		
		if ($result) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	/**
	 * Sign in a user given an email and password
	 */
	public function login(string $email, string $password) {
		$sql = "SELECT id, password FROM users WHERE email = ? LIMIT 1";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$email]);
		
		if (!$result) {
			die("Failed to select user with such email: " . $this->connection->errorInfo());
			/**
			 * TODO add message that user with such email is not registered
			 */
		} else {
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			$passwordHash = $result['password'];
			
			$uid = $result['id'];
			$nickname = $result['nickname'];
			if ($nickname == "") {
				$nickname = "Me";
			}
			
			if (password_verify($password, $passwordHash)) {
				session_start();
				$_SESSION['loggedin'] = true;
				$_SESSION['uid'] = $uid;
				$_SESSION['nickname'] = $nickname;
				/**
				 * TODO add token
				 * TODO add check for remember me
				 */
			} else {
				/**
				 * TODO passwords do not match
				 */
				echo "Passwords do not match";
			}
		}
	}

	/**
	 * Create a new file for user
	 */
	public function createFile(string $uid, string $filename) {
		$sql = "INSERT INTO files (user_id, name, content) VALUES (?, ?, '')";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$uid, $filename]);
		
		if ($result) {
			return $this->connection->lastInsertId();
		} else {
			return FALSE;
		}
	}

	/**
	 * Get a list of all user files
	 */
	public function listFiles(string $uid) {
		$sql = "SELECT id, name FROM files WHERE user_id = ?";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$uid]);
		
		if ($result) {
			return $statement->fetchAll(PDO::FETCH_ASSOC);
		} else {
			return FALSE;
		}
	}

	/**
	 * Create a new file for user
	 */
	public function renameFile(string $file_id, string $newName) {
		// TODO add uid check
		
		$sql = "UPDATE files SET name = ? WHERE id = ?";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$newName, $file_id]);
		if (!$result) {
			return "Failed to rename file: " . $this->connection->errorInfo();
		} else {
			return $newName;
		}
	}

	/**
	 * Save file contents
	 */
	public function saveFile(string $file_id, string $content) {
		// TODO add uid check
		
		$sql = "UPDATE files SET content = ? WHERE id = ?";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$content, $file_id]);
		if ($result) {
			return TRUE;
		} else {
			return FALSE;
		}
	}

	/**
	 * Read file contents
	 */
	public function loadFile(string $file_id) {
		// TODO add uid check
		
		$sql = "SELECT content FROM files WHERE id = ?";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$file_id]);
		$result = $statement->fetch(PDO::FETCH_ASSOC);
		if ($result) {
			return $result['content'];
		} else {
			return FALSE;
		}
	}

	/**
	 * Delete file
	 */
	public function deleteFile(string $file_id) {
		// TODO add uid check
		
		$sql = "DELETE FROM files WHERE id = ?";
        $statement = $this->connection->prepare($sql);
		$result = $statement->execute([$file_id]);
		if ($result) {
			return TRUE;
		} else {
			return FALSE;
		}
	}
}
