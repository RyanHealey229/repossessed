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
// The main function:
//		1. Creates the arrays to count digit occurrences and feature occurrences
//		2. Trains the arrays via test data and Tests test data using the occurrence arrays
//		3. Deletes the occurrence arrays
//==================================================================================================
int main()
{
//------------------------------------------------
// 1.
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
// 2.
	train(freqs, runs);
	test(freqs, runs);

//------------------------------------------------
// 3.
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


/*
 * Train
 * Wrapper function for filling the occurrence arrays from the train data file
 *   then saving and displaying the data
 */
void train(int*** freqs, int* runs)
{
	makeFreqs(freqs, runs);
	saveFreqs(freqs, runs);
	showFreqs(freqs, runs);
}

/*
 * Test
 * Wrapper function for reading the training data into the occurrence arrays
 *   then classifiying images from the test data file
 *   and evaluating the classification using the test data labels file
 */
void test(int*** freqs, int* runs)
{
	readFreqs(freqs, runs);
	classify(freqs, runs, 0.01);
	evaluate();
}


/*
 * Make Frequencies
 * Reads from the traininglabels and trainingimages files
 * Stores '#' and '+' characters as foreground features for each digit image
 *
 * For each line in the label file, set the digit to the value from that line and read an image from the image file
 * For each line in an image, increment i then get the characters in the line
 * For each character in the line, increment j and increment the appropriate feature occurrence if applicable
 */
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

/*
 * Save Frequencies
 * Saves the data from the occurrence array data into the frequences file
 * Used to independently run the test function and the logoddsratio display script
 */
void saveFreqs(int*** freqs, int* runs)
{
	std::ofstream output;
	output.open("res/frequencies");
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

/*
 * Show Frequencies
 * Outputs the occurrence data to the std::cout
 * The character for each pixel feature is determined by its probability
 * A 'more dense' probability gives a 'more dense' character, each digit is outlined
 */
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


/*
 * Read Frequencies
 * Reads data from the frequencies file to the occurrence arrays
 */
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
		if (line[0] == '#')		// Used to declare the digit and get the run count
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
		else					// Read the line into a row of occurrences for the current digit
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

/*
 * Classify
 * Reads data digit-by-digit from the testimages file then compares to training data from each digit
 * Calculates the logarithm of the probability of the test digit matching each trained digit and finds the digit with the highest score
 * @param double k : The smoothing factor to handle 0-instance cases
 */
void classify(int*** freqs, int* runs, double k)
{
	// Initialize variables
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
		// Read an image into the 2D boolean array
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

		// Find the best MAP score
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

/*
 * Get Probability
 * Calculates the probability of a test feature matching a trained feature
 * @param double k : The smoothing factor to handle 0-instance cases
 */
double getProb(int freq, int run_count, double k, bool foreground)
{ return ((foreground ? freq : run_count-freq) + k)/(run_count + k*2); }

/*
 * Evaluate
 * Generates a confusion matrix
 * The row indicates the real digit, determined by the testlabels file
 * The column indicates the output digit, determined by the classifier
 * The value is the number of occurrences that the real digit is mistaken for the output digit
 * The 11th column is the total number of occurrences for each digit
 * The 12th column is the total number of matched cases for each digit
 */
void evaluate()
{
	// Generate and initialize the confusion matrix
	int** conf = new int* [10];
	for (int i = 0; i < 10; i++)
	{
		conf[i] = new int [12];
		for (int j = 0; j < 12; j++)
			conf[i][j] = 0;
	}

	// Read data from the label file and the output file
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

	// Print the percent of correctly matched cases for each digit
	for (int i = 0; i < 10; i++)
	{
		std::cout << i << ":\t" << conf[i][11] << "/" << conf[i][10] << "\t\t= " << 100.0*conf[i][11]/(double)conf[i][10] << "%" << std::endl;
		matched += conf[i][11];
		count += conf[i][10];
	}
	std::cout << "all:\t" << matched << "/" << count << "\t= " << 100.0*matched/(double)count << "%" << std::endl;

	// Print the confusion matrix as a 10x10 table of likelihoods, with borders
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

	// Delete the confusion matrix
	for (int i = 0; i < 10; i++)
		delete[] conf[i];
	delete[] conf;
}























