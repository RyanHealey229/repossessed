CXX		= clang++
LD		= clang++
CXXFLAGS 	= -std=c++1y -c -g -O0 -Wall -Wextra -pedantic
CXXFLAGS_EWS	= -std=c++1y -stdlib=libc++ -c -g -O0 -Wall -Wextra -pedantic
LDFLAGS_EWS	= -std=c++1y -stdlib=libc++ -lpng -lc++abi -lpthread

all : digits
ews : digits_ews

digits : digits.o
	$(LD) digits.o -o digits
digits.o : digits.cpp
	$(CXX) $(CXXFLAGS) digits.cpp

digits_ews : digits_ews.o
	$(LD) $(LDFLAGS_EWS) digits_ews.o -o digits
digits_ews.o : digits.cpp
	$(CXX) $(CXXFLAGS_EWS) digits.cpp


clean :
	-rm -f *.o digits
