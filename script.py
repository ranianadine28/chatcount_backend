import sys
import codecs

sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

text = sys.argv[1]

if text == 'quit':
    sys.exit(0)

response = "Ceci est une réponse statique à votre requête : '{}'".format(text)

print(response)
