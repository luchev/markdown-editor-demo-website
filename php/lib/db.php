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
	 * Constructor for the singleton
	 */
	private function __construct() {
		$this->$dbAuth = new DBAuth();
		$host = $this->$dbAuth->host;
		$port = $this->$dbAuth->port;
		$dbname = $this->$dbAuth->dbname;
		$user = $this->$dbAuth->user;
		$password = $this->$dbAuth->password;

		if (!self::$instance) {
			self::$instance = pg_connect("$host $port $dbname $user $password");
			if (!self::$instance) {
				/**
				 * TODO add proper error message
				 */
				die("Failed to connect to the database: " . pg_last_error());
			}
		}
	}

	/**
	 * Get the instance of the class
	 */
	public static function instance() {
		if (!$instance) {
			self::$instance = new DB();
		}
		return self::$instance;
	}

	/**
	 * TODO remove this method
	 */
	private function insert(string $query) {
		$result = pg_query($query);
		if (!$result) {
			die("Failed to insert: " . pg_last_error());
		}
	}

	/**
	 * TODO remove this method
	 */
	private function select(string $query) {
		$result = pg_query($query);
		if (!$result) {
			die("Failed to select: " . pg_last_error());
		}
		echo json_encode(pg_fetch_all($result), JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
	}

	/**
	 * Sign up a user given an email and password
	 */
	public function signup(string $email, string $password) {
		/**
		 * Hash password before adding it to the db
		 */
		$password = password_hash($password, PASSWORD_DEFAULT);

		$result = pg_query_params('INSERT INTO users (email, password) VALUES ($1, $2)', array($email, $password));
		if (!$result) {
			die("Failed to insert: " . pg_last_error());
			/**
			 * TODO add message when user with such email exists already
			 */
		}
	}

	/**
	 * Sign in a user given an email and password
	 */
	public function signin(string $email, string $password) {
		$result = pg_query_params('SELECT id, password FROM users WHERE email = $1 LIMIT 1', array($email));
		if (!$result) {
			die("Failed to select user with such email: " . pg_last_error());
			/**
			 * TODO add message that user with such email is not registered
			 */
		} else {
			$result = pg_fetch_object($result);
			$passwordHash = $result->password;
			
			$id = $result->id;
			$nickname = $result->nickname;
			if ($nickname == "") {
				$nickname = "Me";
			}

			if (password_verify($password, $passwordHash)) {
				session_start();
				$_SESSION['signedin'] = true;
				$_SESSION['id'] = $id;
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
}
