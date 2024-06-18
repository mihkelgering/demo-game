### Puzzle game for Demos
This is a puzzle game for Demos. The game is a simple puzzle game where the player has to move the blocks to the correct position.

Hint: There is a hidden reset game button in the top right corner. It becomes visible on hover.


#### Making changes
1. push everything to repo.
2. build docker image
3. docker build . --no-cache -t demo-game
4. push image to dockerhub
5. docker tag demo-game:latest <dockerhub-username>/demo-game:latest
6. docker push <dockerhub-username>/demo-game:latest 
7. pull the image from dockerhub
8. docker pull <dockerhub-username>/demo-game:latest
9. run the image
10. docker run --rm --name=demo-game -p 8888:80 -d <dockerhub-username>/demo-game:latest
