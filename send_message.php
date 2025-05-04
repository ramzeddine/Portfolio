<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    try {
        // Connexion à la base de données
        $pdo = new PDO("mysql:host=localhost;dbname=contact_db;charset=utf8", "utilisateur", "mot_de_passe");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Requête d'insertion sécurisée
        $stmt = $pdo->prepare("INSERT INTO messages (name, email, message) VALUES (:name, :email, :message)");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':message' => $message
        ]);

        echo "Merci, $name! Votre message a été enregistré.";
    } catch (PDOException $e) {
        echo "Erreur : " . $e->getMessage();
    }
}
?>