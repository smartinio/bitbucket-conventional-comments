FILE=./cypress.env.json
EXAMPLE=./cypress.env.example.json

if [ ! -f "$FILE" ]; then
  cp $EXAMPLE $FILE
fi
