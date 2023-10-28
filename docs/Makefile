HOME = $(shell pwd)
BIN = $(shell basename ${HOME})

clean:
	rm -f $(BIN)

gen: 
	buf generate --path ./api -o ${HOME}