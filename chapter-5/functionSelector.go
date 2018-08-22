package chapter_5

import (
	"fmt"
	"github.com/ethereum/go-ethereum/crypto"
)

func FunctionSelector() {
	a := []byte("baz(uint32,bool)")
	fmt.Printf("\nsha3(%s)\t\t\t\t\t\t=    %x", a, crypto.Keccak256(a))
	b := []byte("bar(bytes3[2])")
	fmt.Printf("\nsha3(%s)\t\t\t\t\t\t=    %x", b, crypto.Keccak256(b))
	c := []byte("sam(bytes,bool,uint256[])")
	fmt.Printf("\nsha3(%s)\t\t\t\t=    %x", c, crypto.Keccak256(c))
	d := []byte("f(uint256,uint32[],bytes10,bytes)")
	fmt.Printf("\nsha3(%s)\t\t=    %x", d, crypto.Keccak256(d))
}
