package chapter_4

import (
	"fmt"
	"github.com/ethereum/go-ethereum/crypto"
)

func FunctionSelector() {
	a := []byte("complexDynamic(uint256[][],string[])")
	fmt.Printf("\nsha3(%s)\t=\t%x", a, crypto.Keccak256(a))
	b := []byte("dynamicTuple(uint256,uint32[],bytes10,bytes)")
	fmt.Printf("\nsha3(%s)\t=\t%x", b, crypto.Keccak256(b))
	c := []byte("simpleDynamic(bytes,bool,uint256[])")
	fmt.Printf("\nsha3(%s)\t=\t%x", c, crypto.Keccak256(c))
	d := []byte("simpleStatic(uint32,bool)")
	fmt.Printf("\nsha3(%s)\t=\t%x", d, crypto.Keccak256(d))
	e := []byte("staticArray(bytes3[2])")
	fmt.Printf("\nsha3(%s)\t=\t%x", e, crypto.Keccak256(e))
}
