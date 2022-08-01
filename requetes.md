## Register d'un user
http://localhost:5000/api/user/register
{
    "pseudo": "Mag",
    "email": "mag@gmail.com",
    "password": "testtest"
}

## Ajout bio d'un user
http://localhost:5000/api/user/62e7c1e938101d453f50c0aa
{
    "bio": "J'aime les courgettes !",
}

## Suivre un user
http://localhost:5000/api/user/follow/62e6fd34ab20232a862f126c
{
     "idToFollow": "62dd7f9034970987a1a2ad12"
}

## Ne plus suivre un user
http://localhost:5000/api/user/unfollow/62e6fd34ab20232a862f126c
{
     "idToUnfollow": "62dd7f9034970987a1a2ad12"
}

## Se connecter
http://localhost:5000/api/user/login
{
    "email": "mag@gmail.com",
    "password": "testtest"
}

## Se déconnecter
http://localhost:5000/api/user/logout

## Vérifier si un user s'est déjà identifié 
http://localhost:5000/jwtid


## POST
## Création d'un post // récupération des posts avec un GET
http://localhost:5000/api/post
{
    "posterId": "62e7c1e938101d453f50c0aa",
    "message": "1er message"
}

## Update d'un post 
http://localhost:5000/api/post/62e81ca9c186cf2e04ee1f52
{
    "message": "J'aime le beurre et les BN"
}

## Supprimer un post
http://localhost:5000/api/post/62e81c1cc186cf2e04ee1f4e


## Liker un post 
http://localhost:5000/api/post/like-post/62e81ca9c186cf2e04ee1f52
{
    "id": "62e6fd34ab20232a862f126c"
}

## UnLiker un post 
http://localhost:5000/api/post/unlike-post/62e81ca9c186cf2e04ee1f52
{
    "id": "62e6fd34ab20232a862f126c"
}

## Commenter un post 
http://localhost:5000/api/post/comment-post/62e81ca9c186cf2e04ee1f52
{
    "commenterId": "62e7c1e938101d453f50c0aa",
    "commenterPseudo": "Magalie",
    "text": "Voici mon premier commentaire"
}

## Modifier un commentaire 
http://localhost:5000/api/post/edit-comment-post/62e81ca9c186cf2e04ee1f52
{
    "commentId": "62e8301d96a1b5a1fb1d5300",
    "text": "Voici mon premier commentaire modifié !!!"
}

## Supprimer un commentaire
http://localhost:5000/api/post/delete-post/62e81ca9c186cf2e04ee1f52
{
    "commentId": "62e8301d96a1b5a1fb1d5300"
}

## Ajouter une photo de profil user
http://localhost:5000/api/user/upload
selectionner "form-data"
file => ajouter le fichier
name => name du user
userId => id du user

## Ajouter une photo pour un create post
http://localhost:5000/api/post
selectionner "form-data"
file => ajouter le fichier
posterId => id du user
message => message du post