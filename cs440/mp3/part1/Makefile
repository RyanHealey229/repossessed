CXX		= clang++
LD		= clang++
CXXFLAGS 	= -std=c++1y -c -g -O0 -Wall -Wextra -pedantic
CXXFLAGS_EWS	= -std=c++1y -stdlib=libc++ -c -g -O0 -Wall -Wextra -pedantic
LDFLAGS_EWS	= -std=c++1y -stdlib=libc++ -lpng -lc++abi -lpthread

all : digits

digits : digits.o
	$(LD) digits.o -o digits
digits.o : digits.cpp
	$(CXX) $(CXXFLAGS) digits.cpp

clean :
	-rm -f *.o digits
