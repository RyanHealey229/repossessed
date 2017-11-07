#include <iostream>
#include <fstream>
#include <string>
#include <math.h>
#include <cfloat>
#include <iomanip>

void train(int*** freqs, int* runs);
void test(int*** freqs, int* runs);

void makeFreqs(int*** freqs, int* runs);
void saveFreqs(int*** freqs, int* runs);
void showFreqs(int*** freqs, int* runs);

void readFreqs(int*** freqs, int* runs);
void classify(int*** freqs, int* runs, double k);
double getProb(int freq, int run_count, double k, bool foreground);
void evaluate();



//==================================================================================================
//==================================================================================================
int main()
{
	int *runs = new int[10];
	int ***freqs = new int** [10];
	for (int n = 0; n < 10; n++)
	{
		runs[n] = 0;
		freqs[n] = new int* [28]; 
		for (int i = 0; i < 28; i++)
		{
			freqs[n][i] = new int [28];
			for (int j = 0; j < 28; j++)
				freqs[n][i][j] = 0;
		}
	}
//------------------------------------------------

	train(freqs, runs);
	test(freqs, runs);

//------------------------------------------------
	for (int n = 0; n < 10; n++)
		for (int i = 0; i < 28; i++)
			delete[] freqs[n][i];
	for (int n = 0; n < 10; n++)
		delete[] freqs[n];
	delete[] runs;

	return 0;
}
//==================================================================================================
//==================================================================================================



void train(int*** freqs, int* runs)
{
	makeFreqs(freqs, runs);
	saveFreqs(freqs, runs);
	showFreqs(freqs, runs);
}

void test(int*** freqs, int* runs)
{
	readFreqs(freqs, runs);
	classify(freqs, runs, 0.01);
	evaluate();
}



void makeFreqs(int*** freqs, int* runs)
{
	std::ifstream labels, images;
	std::string temp_str;
	labels.open("res/traininglabels");
	images.open("res/trainingimages");
	int n = 0, i = 0, j = 0;
	for (std::string image_line, label_line; getline(labels, label_line); runs[n]++)
		for (n = std::stoi(label_line), i = -1; ++i < 28 && getline(images, image_line); j = -1) 
			for (char c : image_line)
				if (++j == -1 || (c == '#' || c == '+'))
					freqs[n][i][j]++;
}

void saveFreqs(int*** freqs, int* runs)
{
	std::ofstream output;
	output.open("res/frequencies");
	//output << "\n";
	for (int n = 0; n < 10; n++)
	{
		output << "# digit " << n << " runs " << runs[n] << "\n";
		for (int i = 0; i < 28; i++)
		{
			for (int j = 0; j < 28; j++)
				output << freqs[n][i][j] << " ";
			output << "\n";
		}
	}
	output.close();
}

void showFreqs(int*** freqs, int* runs)
{
	int run_count;
	double prob;
	for (int n = 0; n < 10; n++)
	{
		run_count = runs[n];
		std::cout << "Digit: " << n << "  Runs: " << run_count << std::endl;
		if (run_count > 0) {
			std::cout << "+";
			for (int i = 0; i < 28; i++)
				std::cout << "-";
			std::cout << "+" << std::endl;
			for (int i = 0; i < 28; i++)
			{
				std::cout << "|";
				for (int j = 0; j < 28; j++)
				{
					prob = freqs[n][i][j]/(double)run_count;
					if 	(prob >= 0.8)		std::cout << '#';
					else if (prob >= 0.5)		std::cout << 'O';
					else if (prob >= 0.3)		std::cout << '|';
					else if (freqs[n][i][j] > 0)	std::cout << '.';
					else				std::cout << ' ';
				}
				std::cout << "|" << std::endl;
			}
			std::cout << "+";
			for (int i = 0; i < 28; i++)
				std::cout << "-";
			std::cout <<  "+" << std::endl << std::endl;
		}
	}
}



void readFreqs(int*** freqs, int* runs)
{
	std::ifstream input;
	std::string temp_str;
	std::size_t pos, found;
	input.open("res/frequencies");
	int n = -1, i = 0, j = 0;
	for (std::string line; getline(input, line); i++)
	{
		pos = 0, found = 0;
		if (line[0] == '#')
		{
			i = -1;
			n++;
			while ((found = line.find_first_of(' ', pos)) != std::string::npos)
			{
				temp_str = line.substr(pos, found - pos);
				pos = found+1;
			}
			temp_str = line.substr(pos);
			runs[n] = std::stoi(temp_str);
		}
		else
		{
			j = 0;
			while (j < 28 && (found = line.find_first_of(' ', pos)) != std::string::npos)
			{
				temp_str = line.substr(pos, found - pos);
				pos = found+1;
				freqs[n][i][j] = std::stoi(temp_str);
				j++;
			}
		}
	}
	input.close();
}

void classify(int*** freqs, int* runs, double k)
{
	int total = 0, run_count, j, max_n;
	for (int n = 0; n < 10; n++) total += runs[n];
	double map, max_map;

	std::ifstream input;
	std::ofstream output;
	std::string outs = "", line;
	bool eof = false;
	bool** feats = new bool* [28];
	for (int i = 0; i < 28; i++)
	{
		feats[i] = new bool [28];
		for (int j = 0; j < 28; j++)
			feats[i][j] = false;
	}

	input.open("res/testimages");
	while (!eof)
	{
		for (int i = 0; i < 28 && !eof; i++)
		{
			eof = !getline(input, line);
			j = 0;
			for (char c : line)
			{
				if (c == '#' || c == '+')
					feats[i][j] = true;
				else
					feats[i][j] = false;
				j++;
			}
		}

		max_n = 0;
		max_map = -DBL_MAX;
		for (int n = 0; n < 10; n++)
		{
			run_count = runs[n];
			map = log10(run_count/(double)total);
			for (int i = 0; i < 28; i++)
				for (int j = 0; j < 28; j++)
					map += log10(getProb(freqs[n][i][j], run_count, k, feats[i][j]));
			if (map >= max_map)
			{
				max_map = map;
				max_n = n;
			}
		}
		
		outs += std::to_string(max_n);
		if (!eof) outs += "\n";
	}
	input.close();

	output.open("res/testoutput");
	output << outs;
	output.close();
}

double getProb(int freq, int run_count, double k, bool foreground)
{ return ((foreground ? freq : run_count-freq) + k)/(run_count + k*2); }

void evaluate()
{
	int** conf = new int* [10];
	for (int i = 0; i < 10; i++)
	{
		conf[i] = new int [12];
		for (int j = 0; j < 12; j++)
			conf[i][j] = 0;
	}
	std::ifstream labels;
	std::ifstream output;
	int count = 0, matched = 0;
	labels.open("res/testlabels");
	output.open("res/testoutput");
	for (std::string lbl, out; getline(labels, lbl) && getline(output, out);)
	{
		conf[std::stoi(lbl)][10]++;
		if (std::stoi(lbl) == std::stoi(out)) conf[std::stoi(lbl)][11]++;
		else conf[std::stoi(lbl)][std::stoi(out)]++;
	}
	labels.close();
	output.close();

	for (int i = 0; i < 10; i++)
	{
		std::cout << i << ":\t" << conf[i][11] << "/" << conf[i][10] << "\t\t= " << 100.0*conf[i][11]/(double)conf[i][10] << "%" << std::endl;
		matched += conf[i][11];
		count += conf[i][10];
	}
	std::cout << "all:\t" << matched << "/" << count << "\t= " << 100.0*matched/(double)count << "%" << std::endl;

	std::cout << "Confusion: " <<std::endl;
	for (int i = 0; i < 10; i++)
		std::cout << "\t" << i;
	std::cout << std::setprecision(3) << std::fixed << std::endl;
	for (int i = 0; i < 10; i++)
	{
		std::cout << "r: " << i << "|\t";
		for (int j = 0; j < 10; j++)
			std::cout << 100*conf[i][j]/(double)conf[i][10] << '\t';
		std::cout << std::endl;
	}

	for (int i = 0; i < 10; i++)
		delete[] conf[i];
	delete[] conf;
}























