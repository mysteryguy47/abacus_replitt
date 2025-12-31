import { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Trophy, X, Sparkles, Play } from "lucide-react";
import { Link } from "wouter";

type OperationType = 
  | "multiplication" 
  | "division" 
  | "add_sub"
  | "decimal_multiplication"
  | "decimal_division"
  | "integer_add_sub"
  | "lcm"
  | "gcd"
  | "square_root"
  | "cube_root"
  | "percentage";

interface MultiplicationQuestion {
  id: number;
  type: "multiplication";
  multiplicand: number;
  multiplier: number;
  answer: number;
}

interface DivisionQuestion {
  id: number;
  type: "division";
  dividend: number;
  divisor: number;
  answer: number;
}

interface AddSubQuestion {
  id: number;
  type: "add_sub";
  numbers: number[];
  operators: string[]; // ["+", "-", "+", ...]
  answer: number;
}

interface DecimalMultiplicationQuestion {
  id: number;
  type: "decimal_multiplication";
  multiplicand: number;
  multiplier: number;
  multiplicandDecimals: number;
  multiplierDecimals: number;
  answer: number;
}

interface DecimalDivisionQuestion {
  id: number;
  type: "decimal_division";
  dividend: number;
  divisor: number;
  dividendDecimals: number;
  divisorDecimals: number;
  answer: number;
}

interface IntegerAddSubQuestion {
  id: number;
  type: "integer_add_sub";
  numbers: number[];
  operators: string[];
  answer: number;
}

interface LCMQuestion {
  id: number;
  type: "lcm";
  first: number;
  second: number;
  answer: number;
}

interface GCDQuestion {
  id: number;
  type: "gcd";
  first: number;
  second: number;
  answer: number;
}

interface SquareRootQuestion {
  id: number;
  type: "square_root";
  number: number;
  answer: number;
}

interface CubeRootQuestion {
  id: number;
  type: "cube_root";
  number: number;
  answer: number;
}

interface PercentageQuestion {
  id: number;
  type: "percentage";
  number: number;
  percentage: number;
  answer: number;
}

type Question = 
  | MultiplicationQuestion 
  | DivisionQuestion 
  | AddSubQuestion
  | DecimalMultiplicationQuestion
  | DecimalDivisionQuestion
  | IntegerAddSubQuestion
  | LCMQuestion
  | GCDQuestion
  | SquareRootQuestion
  | CubeRootQuestion
  | PercentageQuestion;

// Numeric input component that allows complete deletion with error display
function DecimalNumericInput({
  value,
  onChange,
  min,
  max,
  step = 0.1,
  className = "",
  errorMessage,
}: {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  errorMessage?: string;
}) {
  const [displayValue, setDisplayValue] = useState<string>(String(value));
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef<boolean>(false);
  
  // Sync display value when prop value changes (but not if user is currently editing)
  useEffect(() => {
    if (!isEditingRef.current) {
      setDisplayValue(value.toFixed(1));
      setError("");
    }
  }, [value]);

  const validateAndSetError = (num: number): string => {
    if (num < min) {
      return `Minimum value is ${min}`;
    }
    if (num > max) {
      return `Maximum value is ${max}`;
    }
    return "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onFocus={() => {
          isEditingRef.current = true;
          setError("");
        }}
        onChange={(e) => {
          const val = e.target.value;
          // Allow numbers with optional decimal point and digits
          if (val === "" || /^\d*\.?\d*$/.test(val)) {
            setDisplayValue(val);
            if (val !== "" && val !== ".") {
              const num = parseFloat(val);
              if (!isNaN(num)) {
                const err = validateAndSetError(num);
                setError(err);
                // Round to nearest step
                const roundedNum = Math.round(num / step) * step;
                if (err === "" && roundedNum >= min && roundedNum <= max) {
                  onChange(Number(roundedNum.toFixed(1)));
                }
              }
            } else {
              setError("");
            }
          }
        }}
        onBlur={(e) => {
          isEditingRef.current = false;
          const val = e.target.value;
          if (val === "" || val === "." || isNaN(parseFloat(val))) {
            const defaultVal = min;
            onChange(defaultVal);
            setDisplayValue(defaultVal.toFixed(1));
            setError("");
          } else {
            const num = parseFloat(val);
            const roundedNum = Math.round(num / step) * step;
            const clampedNum = Math.max(min, Math.min(max, roundedNum));
            onChange(Number(clampedNum.toFixed(1)));
            setDisplayValue(clampedNum.toFixed(1));
            setError("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
          }
        }}
        className={`${className || "w-full px-5 py-4 border-2 rounded-xl focus:ring-4 transition-all outline-none font-semibold shadow-sm hover:shadow-md"} ${
          error || errorMessage
            ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-white"
            : "border-purple-200 focus:border-purple-500 focus:ring-purple-200 bg-white"
        }`}
      />
      {(error || errorMessage) && (
        <p className="mt-1 text-sm text-red-600">{error || errorMessage}</p>
      )}
    </div>
  );
}

function NumericInput({
  value,
  onChange,
  min,
  max,
  className = "",
  errorMessage,
}: {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  className?: string;
  errorMessage?: string;
}) {
  const [displayValue, setDisplayValue] = useState<string>(String(value));
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef<boolean>(false);
  
  // Sync display value when prop value changes (but not if user is currently editing)
  useEffect(() => {
    // Only update if user is not currently editing
    if (!isEditingRef.current) {
      setDisplayValue(String(value));
      setError("");
    }
  }, [value]);

  const validateAndSetError = (num: number): string => {
    if (num < min) {
      return `Minimum value is ${min}`;
    }
    if (num > max) {
      return `Maximum value is ${max}`;
    }
    return "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onFocus={() => {
          isEditingRef.current = true;
          setError("");
        }}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "" || /^\d+$/.test(val)) {
            setDisplayValue(val);
            if (val !== "") {
              const num = parseInt(val);
              if (!isNaN(num)) {
                const err = validateAndSetError(num);
                setError(err);
                if (err === "" && num >= min && num <= max) {
                  onChange(num);
                }
              }
            } else {
              setError("");
            }
          }
        }}
        onBlur={(e) => {
          isEditingRef.current = false;
          const val = e.target.value;
          if (val === "" || isNaN(parseInt(val))) {
            onChange(min);
            setDisplayValue(String(min));
            setError("");
          } else {
            const num = parseInt(val);
            const clampedNum = Math.max(min, Math.min(max, num));
            onChange(clampedNum);
            setDisplayValue(String(clampedNum));
            setError("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
          }
        }}
        className={`${className || "w-full px-5 py-4 border-2 rounded-xl focus:ring-4 transition-all outline-none font-semibold shadow-sm hover:shadow-md"} ${
          error || errorMessage
            ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-white"
            : "border-purple-200 focus:border-purple-500 focus:ring-purple-200 bg-white"
        }`}
      />
      {(error || errorMessage) && (
        <p className="mt-1 text-sm text-red-600">{error || errorMessage}</p>
      )}
    </div>
  );
}

export default function Mental() {
  const [operationType, setOperationType] = useState<OperationType>("add_sub");
  const [studentName, setStudentName] = useState("");
  const [studentNameError, setStudentNameError] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  
  // Multiplication/Division inputs
  const [multiplicandDigits, setMultiplicandDigits] = useState(2);
  const [multiplierDigits, setMultiplierDigits] = useState(1);
  const [dividendDigits, setDividendDigits] = useState(2);
  const [divisorDigits, setDivisorDigits] = useState(1);
  
  // Add/Sub inputs
  const [addSubDigits, setAddSubDigits] = useState(2);
  const [addSubRows, setAddSubRows] = useState(3);
  
  // Decimal Multiplication inputs
  const [decimalMultMultiplicandDigits, setDecimalMultMultiplicandDigits] = useState(2);
  const [decimalMultMultiplierDigits, setDecimalMultMultiplierDigits] = useState(1);
  
  // Decimal Division inputs
  const [decimalDivDividendDigits, setDecimalDivDividendDigits] = useState(2);
  const [decimalDivDivisorDigits, setDecimalDivDivisorDigits] = useState(1);
  
  // Integer Add/Sub inputs
  const [integerAddSubDigits, setIntegerAddSubDigits] = useState(2);
  const [integerAddSubRows, setIntegerAddSubRows] = useState(3);
  
  // LCM/GCD inputs
  const [lcmGcdFirstDigits, setLcmGcdFirstDigits] = useState(2);
  const [lcmGcdSecondDigits, setLcmGcdSecondDigits] = useState(2);
  
  // Square/Cube Root inputs
  const [rootDigits, setRootDigits] = useState(4);
  
  // Percentage inputs
  const [percentageMin, setPercentageMin] = useState(1);
  const [percentageMax, setPercentageMax] = useState(100);
  const [percentageNumberDigits, setPercentageNumberDigits] = useState(4);
  
  // Time limits
  const [timeLimit, setTimeLimit] = useState(30);
  const [addSubRowTime, setAddSubRowTime] = useState(1.0); // Time to show each row (Duration)
  const addSubAnswerTime = 10; // Fixed: Time to answer after all rows shown (always 10s)
  
  const [isStarted, setIsStarted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Array<{ question: Question; userAnswer: number | null; isCorrect: boolean }>>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Add/Sub specific state
  const [addSubDisplayIndex, setAddSubDisplayIndex] = useState(0); // Which row is currently being shown
  const [addSubDisplayedNumbers, setAddSubDisplayedNumbers] = useState<string>(""); // What's currently displayed
  const [isShowingAnswerTime, setIsShowingAnswerTime] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const addSubRowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const currentQuestionIndexRef = useRef<number>(0);
  const questionsRef = useRef<Question[]>([]);



  // Generate questions based on operation type
  const generateQuestions = (count: number): Question[] => {
    const questionsList: Question[] = [];
    
    if (operationType === "multiplication") {
      for (let i = 0; i < count; i++) {
        const multiplicandMin = Math.pow(10, multiplicandDigits - 1);
        const multiplicandMax = Math.pow(10, multiplicandDigits) - 1;
        const multiplierMin = Math.pow(10, multiplierDigits - 1);
        const multiplierMax = Math.pow(10, multiplierDigits) - 1;
        
        const multiplicand = Math.floor(Math.random() * (multiplicandMax - multiplicandMin + 1)) + multiplicandMin;
        const multiplier = Math.floor(Math.random() * (multiplierMax - multiplierMin + 1)) + multiplierMin;
        
        questionsList.push({
          id: i + 1,
          type: "multiplication",
          multiplicand,
          multiplier,
          answer: multiplicand * multiplier
        });
      }
    } else if (operationType === "division") {
      for (let i = 0; i < count; i++) {
        const divisorMin = Math.pow(10, divisorDigits - 1);
        const divisorMax = Math.pow(10, divisorDigits) - 1;
        
        // Generate divisor first
        const divisor = Math.floor(Math.random() * (divisorMax - divisorMin + 1)) + divisorMin;
        
        // Calculate the quotient range that will give us a dividend with the correct number of digits
        const dividendMin = Math.pow(10, dividendDigits - 1);
        const dividendMax = Math.pow(10, dividendDigits) - 1;
        
        // Calculate quotient range: dividendMin/divisor to dividendMax/divisor
        const quotientMin = Math.ceil(dividendMin / divisor);
        const quotientMax = Math.floor(dividendMax / divisor);
        
        // Generate a quotient in the valid range
        const quotient = Math.floor(Math.random() * (quotientMax - quotientMin + 1)) + quotientMin;
        const dividend = divisor * quotient; // Ensure clean division
        
        questionsList.push({
          id: i + 1,
          type: "division",
          dividend,
          divisor,
          answer: quotient
        });
      }
    } else if (operationType === "add_sub") {
      for (let i = 0; i < count; i++) {
        const numMin = Math.pow(10, addSubDigits - 1);
        const numMax = Math.pow(10, addSubDigits) - 1;
        
        const numbers: number[] = [];
        const operators: string[] = [];
        let result = 0;
        
        // Generate first number (always positive, no operator)
        const firstNum = Math.floor(Math.random() * (numMax - numMin + 1)) + numMin;
        numbers.push(firstNum);
        result = firstNum;
        
        // Generate remaining numbers with random operators, ensuring result never goes negative during generation
        for (let j = 1; j < addSubRows; j++) {
          const num = Math.floor(Math.random() * (numMax - numMin + 1)) + numMin;
          // If current result is less than num, we must add (can't subtract or result would go negative)
          const isAdd = result < num ? true : Math.random() > 0.5;
          
          operators.push(isAdd ? "+" : "-");
          numbers.push(num);
          result += isAdd ? num : -num;
          
          // Safety check: if result went negative (shouldn't happen), force it positive by changing last operator to add
          if (result < 0) {
            operators[operators.length - 1] = "+";
            result = numbers.slice(0, -1).reduce((sum, n, idx) => {
              if (idx === 0) return n;
              return operators[idx - 1] === "+" ? sum + n : sum - n;
            }, numbers[0]) + num;
          }
        }
        
        // Ensure final answer is positive (regenerate if negative - this is a safety check)
        if (result < 0) {
          i--; // Retry this question
          continue;
        }
        
        questionsList.push({
          id: i + 1,
          type: "add_sub",
          numbers,
          operators,
          answer: result
        });
      }
    } else if (operationType === "decimal_multiplication") {
      for (let i = 0; i < count; i++) {
        // Generate multiplicand: digits_before_decimal + 1 decimal place
        const multiplicandMin = Math.pow(10, decimalMultMultiplicandDigits - 1);
        const multiplicandMax = Math.pow(10, decimalMultMultiplicandDigits) - 1;
        const multiplicandWhole = Math.floor(Math.random() * (multiplicandMax - multiplicandMin + 1)) + multiplicandMin;
        const multiplicandDecimal = Math.floor(Math.random() * 10);
        const multiplicand = (multiplicandWhole * 10 + multiplicandDecimal) / 10.0;
        
        // Generate multiplier
        let multiplier: number;
        if (decimalMultMultiplierDigits === 0) {
          // Whole number
          multiplier = Math.floor(Math.random() * 99) + 1;
        } else {
          // Decimal: digits_before_decimal + 1 decimal place
          const multiplierMin = Math.pow(10, decimalMultMultiplierDigits - 1);
          const multiplierMax = Math.pow(10, decimalMultMultiplierDigits) - 1;
          const multiplierWhole = Math.floor(Math.random() * (multiplierMax - multiplierMin + 1)) + multiplierMin;
          const multiplierDecimal = Math.floor(Math.random() * 10);
          multiplier = (multiplierWhole * 10 + multiplierDecimal) / 10.0;
        }
        
        const answer = multiplicand * multiplier;
        
        questionsList.push({
          id: i + 1,
          type: "decimal_multiplication",
          multiplicand,
          multiplier,
          multiplicandDecimals: 1,
          multiplierDecimals: decimalMultMultiplierDigits === 0 ? 0 : 1,
          answer: Math.round(answer * 100) / 100 // Round to 2 decimal places
        });
      }
    } else if (operationType === "decimal_division") {
      for (let i = 0; i < count; i++) {
        // Generate whole number divisor
        const divisorMin = Math.pow(10, decimalDivDivisorDigits - 1);
        const divisorMax = Math.pow(10, decimalDivDivisorDigits) - 1;
        const divisor = Math.floor(Math.random() * (divisorMax - divisorMin + 1)) + divisorMin;
        
        // Generate whole number dividend that will result in a decimal answer
        const dividendMin = Math.pow(10, decimalDivDividendDigits - 1);
        const dividendMax = Math.pow(10, decimalDivDividendDigits) - 1;
        
        // Generate a dividend that is NOT divisible by the divisor to ensure decimal answer
        let dividend: number;
        let attempts = 0;
        do {
          dividend = Math.floor(Math.random() * (dividendMax - dividendMin + 1)) + dividendMin;
          attempts++;
        } while (dividend % divisor === 0 && attempts < 100); // Ensure non-exact division
        
        const answer = dividend / divisor;
        
        questionsList.push({
          id: i + 1,
          type: "decimal_division",
          dividend,
          divisor,
          dividendDecimals: 0, // Whole numbers
          divisorDecimals: 0, // Whole numbers
          answer: Math.round(answer * 100) / 100 // Round to 2 decimal places
        });
      }
    } else if (operationType === "integer_add_sub") {
      for (let i = 0; i < count; i++) {
        const numMin = Math.pow(10, integerAddSubDigits - 1);
        const numMax = Math.pow(10, integerAddSubDigits) - 1;
        
        const numbers: number[] = [];
        const operators: string[] = [];
        let result = 0;
        
        const firstNum = Math.floor(Math.random() * (numMax - numMin + 1)) + numMin;
        numbers.push(firstNum);
        result = firstNum;
        
        for (let j = 1; j < integerAddSubRows; j++) {
          const num = Math.floor(Math.random() * (numMax - numMin + 1)) + numMin;
          const isAdd = Math.random() > 0.5;
          operators.push(isAdd ? "+" : "-");
          numbers.push(num);
          result += isAdd ? num : -num;
        }
        
        questionsList.push({
          id: i + 1,
          type: "integer_add_sub",
          numbers,
          operators,
          answer: result
        });
      }
    } else if (operationType === "lcm") {
      for (let i = 0; i < count; i++) {
        const firstMin = Math.pow(10, lcmGcdFirstDigits - 1);
        const firstMax = Math.pow(10, lcmGcdFirstDigits) - 1;
        const secondMin = Math.pow(10, lcmGcdSecondDigits - 1);
        const secondMax = Math.pow(10, lcmGcdSecondDigits) - 1;
        
        const first = Math.floor(Math.random() * (firstMax - firstMin + 1)) + firstMin;
        const second = Math.floor(Math.random() * (secondMax - secondMin + 1)) + secondMin;
        
        // Calculate LCM
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const lcm = (first * second) / gcd(first, second);
        
        questionsList.push({
          id: i + 1,
          type: "lcm",
          first,
          second,
          answer: lcm
        });
      }
    } else if (operationType === "gcd") {
      for (let i = 0; i < count; i++) {
        const firstMin = Math.pow(10, lcmGcdFirstDigits - 1);
        const firstMax = Math.pow(10, lcmGcdFirstDigits) - 1;
        const secondMin = Math.pow(10, lcmGcdSecondDigits - 1);
        const secondMax = Math.pow(10, lcmGcdSecondDigits) - 1;
        
        const first = Math.floor(Math.random() * (firstMax - firstMin + 1)) + firstMin;
        const second = Math.floor(Math.random() * (secondMax - secondMin + 1)) + secondMin;
        
        // Calculate GCD
        const gcdFunc = (a: number, b: number): number => b === 0 ? a : gcdFunc(b, a % b);
        const gcdValue = gcdFunc(first, second);
        
        questionsList.push({
          id: i + 1,
          type: "gcd",
          first,
          second,
          answer: gcdValue
        });
      }
    } else if (operationType === "square_root") {
      for (let i = 0; i < count; i++) {
        // Generate a perfect square
        const targetMin = Math.pow(10, rootDigits - 1);
        const targetMax = Math.pow(10, rootDigits) - 1;
        
        const minRoot = Math.ceil(Math.sqrt(targetMin));
        const maxRoot = Math.floor(Math.sqrt(targetMax));
        
        const root = Math.floor(Math.random() * (maxRoot - minRoot + 1)) + minRoot;
        const number = root * root;
        
        questionsList.push({
          id: i + 1,
          type: "square_root",
          number,
          answer: root
        });
      }
    } else if (operationType === "cube_root") {
      for (let i = 0; i < count; i++) {
        // Generate a perfect cube
        const targetMin = Math.pow(10, rootDigits - 1);
        const targetMax = Math.pow(10, rootDigits) - 1;
        
        const minRoot = Math.ceil(Math.cbrt(targetMin));
        const maxRoot = Math.floor(Math.cbrt(targetMax));
        
        const root = Math.floor(Math.random() * (maxRoot - minRoot + 1)) + minRoot;
        const number = root * root * root;
        
        questionsList.push({
          id: i + 1,
          type: "cube_root",
          number,
          answer: root
        });
      }
    } else if (operationType === "percentage") {
      for (let i = 0; i < count; i++) {
        const percentage = Math.floor(Math.random() * (percentageMax - percentageMin + 1)) + percentageMin;
        const numberMin = Math.pow(10, percentageNumberDigits - 1);
        const numberMax = Math.pow(10, percentageNumberDigits) - 1;
        const number = Math.floor(Math.random() * (numberMax - numberMin + 1)) + numberMin;
        
        const answer = (number * percentage) / 100;
        
        questionsList.push({
          id: i + 1,
          type: "percentage",
          number,
          percentage,
          answer: Math.round(answer * 100) / 100 // Round to 2 decimal places
        });
      }
    }
    
    return questionsList;
  };

  const startCountdown = () => {
    // Validate name is provided
    if (!studentName || studentName.trim() === "") {
      setStudentNameError("Name is required");
      return;
    }
    setStudentNameError("");
    
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = () => {
    const generatedQuestions = generateQuestions(numQuestions);
    setQuestions(generatedQuestions);
    questionsRef.current = generatedQuestions; // Update ref
    setCurrentQuestionIndex(0);
    currentQuestionIndexRef.current = 0; // Update ref
    setScore(0);
    setResults([]);
    setCurrentAnswer("");
    setIsStarted(true);
    setIsGameOver(false);
    setAddSubDisplayIndex(0);
    setAddSubDisplayedNumbers("");
    setIsShowingAnswerTime(false);
    
    // Clear any existing timers
    if (addSubRowTimerRef.current) {
      clearTimeout(addSubRowTimerRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Use setTimeout to ensure state is updated before accessing questions
    setTimeout(() => {
      if (operationType === "add_sub" || operationType === "integer_add_sub") {
        startAddSubQuestion();
      } else {
        setTimeRemaining(timeLimit);
        startTimer();
      }
    }, 100);
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startAddSubQuestion = () => {
    // Clear any existing timers first
    if (addSubRowTimerRef.current) {
      clearTimeout(addSubRowTimerRef.current);
      addSubRowTimerRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Get current question from refs (always fresh)
    const q = questionsRef.current[currentQuestionIndexRef.current];
    
    // Validate question exists and is correct type
    if (!q || (q.type !== "add_sub" && q.type !== "integer_add_sub")) {
      return;
    }
    
    const currentQ = q as AddSubQuestion | IntegerAddSubQuestion;
    
    // Validate question has numbers
    if (!currentQ.numbers || currentQ.numbers.length === 0) {
      return;
    }
    
    // Reset state
    setAddSubDisplayIndex(0);
    setIsShowingAnswerTime(false);
    setTimeRemaining(0);
    
    // Show first number immediately
    setAddSubDisplayedNumbers(String(currentQ.numbers[0]));
    
    // If only one number, go straight to answer time
    if (currentQ.numbers.length === 1) {
      setIsShowingAnswerTime(true);
      setTimeRemaining(addSubAnswerTime);
      startTimer();
      return;
    }
    
    // Store question data in local scope to avoid closure issues
    const questionNumbers = [...currentQ.numbers];
    const questionOperators = [...currentQ.operators];
    const totalRows = questionNumbers.length;
    let currentRowIndex = 0; // Already shown index 0
    const questionIndexAtStart = currentQuestionIndexRef.current; // Capture index at start
    
    // Function to show next row - defined here to capture question data
    const showNextRow = () => {
      // Check if question index has changed (user moved to next question)
      if (currentQuestionIndexRef.current !== questionIndexAtStart) {
        addSubRowTimerRef.current = null;
        return;
      }
      
      currentRowIndex++;
      
      // Check if we've shown all rows
      if (currentRowIndex >= totalRows) {
        // All rows shown, transition to answer time
        setIsShowingAnswerTime(true);
        setTimeRemaining(addSubAnswerTime);
        startTimer();
        addSubRowTimerRef.current = null;
        return;
      }
      
      // Build display text: show all numbers from start up to current row
      const displayText = questionNumbers.slice(0, currentRowIndex + 1).map((num, idx) => {
        if (idx === 0) return String(num);
        return `${questionOperators[idx - 1]} ${num}`;
      }).join(" ");
      
      // Update display state
      setAddSubDisplayedNumbers(displayText);
      setAddSubDisplayIndex(currentRowIndex);
      
      // Schedule next row
      addSubRowTimerRef.current = setTimeout(showNextRow, addSubRowTime * 1000) as any;
    };
    
    // Start showing rows after initial delay
    addSubRowTimerRef.current = setTimeout(showNextRow, addSubRowTime * 1000) as any;
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (addSubRowTimerRef.current) {
      clearTimeout(addSubRowTimerRef.current);
    }
    
    const currentQ = questions[currentQuestionIndex];
    const userAns = currentAnswer === "" ? null : parseFloat(currentAnswer);
    const isCorrect = userAns !== null && Math.abs(userAns - currentQ.answer) < 0.01; // Allow small floating point differences
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    const newResults = [
      ...results,
      { question: currentQ, userAnswer: userAns, isCorrect }
    ];
    setResults(newResults);
    
    // Move to next question or end game
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      currentQuestionIndexRef.current = nextIndex; // Update ref
      setCurrentAnswer("");
      setAddSubDisplayIndex(0);
      setAddSubDisplayedNumbers("");
      setIsShowingAnswerTime(false);
      
      if (operationType === "add_sub" || operationType === "integer_add_sub") {
        // Small delay to ensure state is reset before starting
        setTimeout(() => startAddSubQuestion(), 100);
      } else {
        setTimeRemaining(timeLimit);
        startTimer();
      }
    } else {
      endGame(newResults);
    }
  };

  const handleSubmitAnswer = () => {
    if ((operationType === "add_sub" || operationType === "integer_add_sub") && !isShowingAnswerTime) {
      // Can't submit during row display phase
      return;
    }
    
    if (currentAnswer === "") return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (addSubRowTimerRef.current) {
      clearTimeout(addSubRowTimerRef.current);
    }
    
    const currentQ = questions[currentQuestionIndex];
    const userAns = parseFloat(currentAnswer);
    const isCorrect = Math.abs(userAns - currentQ.answer) < 0.01; // Allow small floating point differences
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    const newResults = [
      ...results,
      { question: currentQ, userAnswer: userAns, isCorrect }
    ];
    setResults(newResults);
    
    // Move to next question or end game
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      currentQuestionIndexRef.current = nextIndex; // Update ref
      setCurrentAnswer("");
      setAddSubDisplayIndex(0);
      setAddSubDisplayedNumbers("");
      setIsShowingAnswerTime(false);
      
      if (operationType === "add_sub" || operationType === "integer_add_sub") {
        // Small delay to ensure state is reset before starting
        setTimeout(() => startAddSubQuestion(), 100);
      } else {
        setTimeRemaining(timeLimit);
        startTimer();
      }
    } else {
      endGame(newResults);
    }
  };

  const endGame = (finalResults: Array<{ question: Question; userAnswer: number | null; isCorrect: boolean }>) => {
    setIsGameOver(true);
    setIsStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (addSubRowTimerRef.current) {
      clearTimeout(addSubRowTimerRef.current);
    }
  };

  const exitPractice = () => {
    // Clear all timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (addSubRowTimerRef.current) {
      clearTimeout(addSubRowTimerRef.current);
    }
    // Reset game state
    setIsStarted(false);
    setCountdown(0);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setCurrentAnswer("");
    setScore(0);
    setResults([]);
    setTimeRemaining(0);
    setIsGameOver(false);
    setAddSubDisplayIndex(0);
    setAddSubDisplayedNumbers("");
    setIsShowingAnswerTime(false);
  };

  const resetGame = () => {
    setIsStarted(false);
    setCountdown(0);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setCurrentAnswer("");
    setScore(0);
    setResults([]);
    setTimeRemaining(0);
    setIsGameOver(false);
    setAddSubDisplayIndex(0);
    setAddSubDisplayedNumbers("");
    setIsShowingAnswerTime(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (addSubRowTimerRef.current) {
      clearTimeout(addSubRowTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      if (addSubRowTimerRef.current) {
        clearTimeout(addSubRowTimerRef.current);
      }
    };
  }, []);

  // Update refs whenever questions or index change
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);
  
  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;
  
  // Auto-focus input when question changes (for multiplication and division, or when answer time starts for add/sub)
  useEffect(() => {
    if (isStarted && currentQuestion) {
      if ((currentQuestion.type !== "add_sub" && currentQuestion.type !== "integer_add_sub") || isShowingAnswerTime) {
        // Focus on input after a short delay to ensure it's rendered
        const timer = setTimeout(() => {
          if (answerInputRef.current) {
            answerInputRef.current.focus();
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isStarted, currentQuestionIndex, isShowingAnswerTime, currentQuestion]);

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-pulse">
            {countdown}
          </div>
          <p className="text-2xl font-semibold text-gray-700 mt-4">Get Ready!</p>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    const percentage = (score / numQuestions) * 100;
    const getPerformanceMessage = () => {
      if (percentage === 100) return "Perfect! 🌟";
      if (percentage >= 80) return "Excellent! 🎉";
      if (percentage >= 60) return "Great Job! 👏";
      if (percentage >= 40) return "Good Effort! 💪";
      return "Keep Practicing! 📚";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mt-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {studentName ? `${studentName}'s Results` : "Results"}
              </h1>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 my-4">
                {score}/{numQuestions}
              </div>
              <p className="text-2xl font-semibold text-gray-700 mb-2">{getPerformanceMessage()}</p>
              <p className="text-lg text-gray-600">{percentage.toFixed(0)}% Correct</p>
            </div>

            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
              {results.map((result, index) => {
              let questionText = "";
              if (result.question.type === "multiplication") {
                questionText = `${result.question.multiplicand} × ${result.question.multiplier} = ?`;
              } else if (result.question.type === "division") {
                questionText = `${result.question.dividend} ÷ ${result.question.divisor} = ?`;
              } else if (result.question.type === "add_sub" || result.question.type === "integer_add_sub") {
                const displayText = result.question.numbers.map((num, idx) => {
                  if (idx === 0) return String(num);
                  return `${result.question.operators[idx - 1]} ${num}`;
                }).join(" ");
                questionText = `${displayText} = ?`;
              } else if (result.question.type === "decimal_multiplication") {
                questionText = `${result.question.multiplicand.toFixed(1)} × ${result.question.multiplier.toFixed(result.question.multiplierDecimals)} = ?`;
              } else if (result.question.type === "decimal_division") {
                questionText = `${result.question.dividend} ÷ ${result.question.divisor} = ?`;
              } else if (result.question.type === "lcm") {
                questionText = `LCM(${result.question.first}, ${result.question.second}) = ?`;
              } else if (result.question.type === "gcd") {
                questionText = `GCD(${result.question.first}, ${result.question.second}) = ?`;
              } else if (result.question.type === "square_root") {
                questionText = `√${result.question.number} = ?`;
              } else if (result.question.type === "cube_root") {
                questionText = `∛${result.question.number} = ?`;
              } else if (result.question.type === "percentage") {
                questionText = `${result.question.percentage}% of ${result.question.number} = ?`;
              }
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    result.isCorrect
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {questionText}
                        </p>
                        <p className="text-sm text-gray-600">
                          Your Answer: {result.userAnswer ?? "No answer"} | 
                          Correct Answer: {result.question.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Try Again
              </button>
              <Link href="/">
                <button className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                  Go Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isStarted && currentQuestion) {
    // Handle Add/Sub question display (row by row)
    if ((currentQuestion.type === "add_sub" || currentQuestion.type === "integer_add_sub") && !isShowingAnswerTime) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mt-8 relative">
              {/* Exit Button */}
              <button
                onClick={exitPractice}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Exit Practice"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Question {currentQuestionIndex + 1} of {numQuestions}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    Score: {score}/{results.length > 0 ? results.length : currentQuestionIndex}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / numQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Display (Row by Row) */}
              <div className="text-center mb-8">
                <div className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mb-4">
                  {addSubDisplayedNumbers}
                </div>
                <p className="text-xl text-gray-500 mt-4">
                  Showing row {addSubDisplayIndex + 1} of {currentQuestion.numbers.length}
                </p>
              </div>

              {/* Wait message */}
              <div className="text-center">
                <p className="text-lg text-gray-600">Watch carefully...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle regular question display
    let questionDisplay = "";
    if (currentQuestion.type === "multiplication") {
      questionDisplay = `${currentQuestion.multiplicand} × ${currentQuestion.multiplier}`;
    } else if (currentQuestion.type === "division") {
      questionDisplay = `${currentQuestion.dividend} ÷ ${currentQuestion.divisor}`;
    } else if (currentQuestion.type === "add_sub" || currentQuestion.type === "integer_add_sub") {
      // Show full question during answer time
      questionDisplay = currentQuestion.numbers.map((num, idx) => {
        if (idx === 0) return String(num);
        return `${currentQuestion.operators[idx - 1]} ${num}`;
      }).join(" ");
    } else if (currentQuestion.type === "decimal_multiplication") {
      questionDisplay = `${currentQuestion.multiplicand.toFixed(1)} × ${currentQuestion.multiplier.toFixed(currentQuestion.multiplierDecimals)}`;
    } else if (currentQuestion.type === "decimal_division") {
      questionDisplay = `${currentQuestion.dividend} ÷ ${currentQuestion.divisor}`;
    } else if (currentQuestion.type === "lcm") {
      questionDisplay = `LCM(${currentQuestion.first}, ${currentQuestion.second})`;
    } else if (currentQuestion.type === "gcd") {
      questionDisplay = `GCD(${currentQuestion.first}, ${currentQuestion.second})`;
    } else if (currentQuestion.type === "square_root") {
      questionDisplay = `√${currentQuestion.number}`;
    } else if (currentQuestion.type === "cube_root") {
      questionDisplay = `∛${currentQuestion.number}`;
    } else if (currentQuestion.type === "percentage") {
      questionDisplay = `${currentQuestion.percentage}% of ${currentQuestion.number}`;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mt-8 relative">
            {/* Exit Button */}
            <button
              onClick={exitPractice}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Exit Practice"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Question {currentQuestionIndex + 1} of {numQuestions}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  Score: {score}/{results.length > 0 ? results.length : currentQuestionIndex}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / numQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Timer */}
            {isShowingAnswerTime || (currentQuestion.type !== "add_sub" && currentQuestion.type !== "integer_add_sub") ? (
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                  <span className="text-3xl font-bold text-white">{timeRemaining}s</span>
                </div>
              </div>
            ) : null}

            {/* Question */}
            <div className="text-center mb-8">
              <div className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mb-4">
                {questionDisplay}
              </div>
              <p className="text-2xl text-gray-600">= ?</p>
            </div>

            {/* Answer Input */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                inputMode="decimal"
                value={currentAnswer}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow empty, integers, decimals, and negative numbers
                  if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                    setCurrentAnswer(val);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitAnswer();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter your answer"
                className="w-full px-6 py-4 text-3xl font-bold text-center border-4 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all"
                autoFocus={!((currentQuestion.type === "add_sub" || currentQuestion.type === "integer_add_sub") && !isShowingAnswerTime)}
                disabled={(currentQuestion.type === "add_sub" || currentQuestion.type === "integer_add_sub") && !isShowingAnswerTime}
                ref={(input) => {
                  answerInputRef.current = input;
                }}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={currentAnswer === "" || ((currentQuestion.type === "add_sub" || currentQuestion.type === "integer_add_sub") && !isShowingAnswerTime)}
                className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">
        <Link href="/">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors mb-6 hover:bg-white/50 rounded-xl backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </Link>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-8 md:px-12 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-50"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                Mental Math Practice
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-medium">
                Challenge yourself with timed math questions
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-12">
            <div className="space-y-8 max-w-2xl mx-auto">
            {/* Operation Type */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Operation Type
              </label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value as OperationType)}
                className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md"
              >
                <optgroup label="Basic Operations">
                  <option value="add_sub">Add/Subtract</option>
                  <option value="multiplication">Multiplication</option>
                  <option value="division">Division</option>
                </optgroup>
                <optgroup label="Advanced Operations">
                  <option value="integer_add_sub">Integer Add/Subtract</option>
                  <option value="decimal_multiplication">Decimal Multiplication</option>
                  <option value="decimal_division">Decimal Division</option>
                  <option value="lcm">LCM</option>
                  <option value="gcd">GCD</option>
                  <option value="square_root">Square Root</option>
                  <option value="cube_root">Cube Root</option>
                  <option value="percentage">Percentage</option>
                </optgroup>
              </select>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setStudentNameError("");
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim() === "") {
                    setStudentNameError("Name is required");
                  } else {
                    setStudentNameError("");
                  }
                }}
                placeholder="Enter your name"
                className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-4 transition-all outline-none bg-white text-gray-900 font-medium shadow-sm hover:shadow-md ${
                  studentNameError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-purple-200 focus:border-purple-500 focus:ring-purple-200"
                }`}
              />
              {studentNameError && (
                <p className="mt-2 text-sm font-medium text-red-600">{studentNameError}</p>
              )}
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Number of Questions <span className="text-gray-500 font-normal text-xs"><span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 50)</span></span>
              </label>
              <NumericInput
                value={numQuestions}
                onChange={setNumQuestions}
                min={1}
                max={50}
                className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md"
              />
            </div>

            {/* Multiplication/Division specific inputs */}
            {(operationType === "multiplication" || operationType === "division") && (
              <>
                {operationType === "multiplication" ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Multiplicand Digits <span className="text-gray-500 font-normal text-xs"><span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span></span>
                      </label>
                      <NumericInput
                        value={multiplicandDigits}
                        onChange={setMultiplicandDigits}
                        min={1}
                        max={10}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Multiplier Digits <span className="text-gray-500 font-normal text-xs"><span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span></span>
                      </label>
                      <NumericInput
                        value={multiplierDigits}
                        onChange={setMultiplierDigits}
                        min={1}
                        max={10}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Dividend Digits <span className="text-gray-500 font-normal text-xs"><span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span></span>
                      </label>
                      <NumericInput
                        value={dividendDigits}
                        onChange={setDividendDigits}
                        min={1}
                        max={10}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Divisor Digits <span className="text-gray-500 font-normal text-xs"><span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span></span>
                      </label>
                      <NumericInput
                        value={divisorDigits}
                        onChange={setDivisorDigits}
                        min={1}
                        max={10}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md"
                      />
                    </div>
                  </>
                )}
                {/* Time Limit for Multiplication/Division */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Time Limit per Question <span className="text-gray-500 font-normal text-xs"><span className="text-gray-500 font-normal text-xs">(seconds, Min: 5, Max: 300)</span></span>
                  </label>
                  <NumericInput
                    value={timeLimit}
                    onChange={setTimeLimit}
                    min={5}
                    max={300}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md"
                  />
                </div>
              </>
            )}

            {/* Decimal Multiplication inputs */}
            {operationType === "decimal_multiplication" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Multiplicand Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 20)</span>
                  </label>
                    <NumericInput
                      value={decimalMultMultiplicandDigits}
                      onChange={setDecimalMultMultiplicandDigits}
                      min={1}
                      max={20}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Multiplier Digits <span className="text-gray-500 font-normal text-xs">(Min: 0, Max: 20, 0 = whole number)</span>
                  </label>
                    <NumericInput
                      value={decimalMultMultiplierDigits}
                      onChange={setDecimalMultMultiplierDigits}
                      min={0}
                      max={20}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Time Limit per Question <span className="text-gray-500 font-normal text-xs">(seconds, Min: 5, Max: 300)</span>
                  </label>
                  <NumericInput
                    value={timeLimit}
                    onChange={setTimeLimit}
                    min={5}
                    max={300}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                  />
                </div>
              </>
            )}

            {/* Decimal Division inputs */}
            {operationType === "decimal_division" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Dividend Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 20)</span>
                  </label>
                    <NumericInput
                      value={decimalDivDividendDigits}
                      onChange={setDecimalDivDividendDigits}
                      min={1}
                      max={20}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Divisor Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 20)</span>
                      </label>
                      <NumericInput
                        value={decimalDivDivisorDigits}
                        onChange={setDecimalDivDivisorDigits}
                        min={1}
                        max={20}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Time Limit per Question <span className="text-gray-500 font-normal text-xs">(seconds, Min: 5, Max: 300)</span>
                  </label>
                  <NumericInput
                    value={timeLimit}
                    onChange={setTimeLimit}
                    min={5}
                    max={300}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                  />
                </div>
              </>
            )}

            {/* Integer Add/Sub inputs */}
            {operationType === "integer_add_sub" && (
              <>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Number of Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span>
                      </label>
                    <NumericInput
                      value={integerAddSubDigits}
                      onChange={setIntegerAddSubDigits}
                      min={1}
                      max={10}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Number of Rows <span className="text-gray-500 font-normal text-xs">(Min: 2, Max: 20)</span>
                      </label>
                      <NumericInput
                        value={integerAddSubRows}
                        onChange={setIntegerAddSubRows}
                        min={2}
                        max={20}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Duration <span className="text-gray-500 font-normal text-xs">(seconds, Min: 0.1, Max: 10, Step: 0.1)</span>
                      </label>
                      <DecimalNumericInput
                        value={addSubRowTime}
                        onChange={setAddSubRowTime}
                        min={0.1}
                        max={10}
                        step={0.1}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
              </>
            )}

            {/* LCM/GCD inputs */}
            {(operationType === "lcm" || operationType === "gcd") && (
              <>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        First Number Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span>
                      </label>
                    <NumericInput
                      value={lcmGcdFirstDigits}
                      onChange={setLcmGcdFirstDigits}
                      min={1}
                      max={10}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Second Number Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span>
                      </label>
                      <NumericInput
                        value={lcmGcdSecondDigits}
                        onChange={setLcmGcdSecondDigits}
                        min={1}
                        max={10}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Time Limit per Question <span className="text-gray-500 font-normal text-xs">(seconds, Min: 5, Max: 300)</span>
                  </label>
                  <NumericInput
                    value={timeLimit}
                    onChange={setTimeLimit}
                    min={5}
                    max={300}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                  />
                </div>
              </>
            )}

            {/* Square/Cube Root inputs */}
            {(operationType === "square_root" || operationType === "cube_root") && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Root Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 30)</span>
                  </label>
                    <NumericInput
                      value={rootDigits}
                      onChange={setRootDigits}
                      min={1}
                      max={30}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Time Limit per Question <span className="text-gray-500 font-normal text-xs">(seconds, Min: 5, Max: 300)</span>
                  </label>
                  <NumericInput
                    value={timeLimit}
                    onChange={setTimeLimit}
                    min={5}
                    max={300}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                  />
                </div>
              </>
            )}

            {/* Percentage inputs */}
            {operationType === "percentage" && (
              <>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Percentage Min <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 100)</span>
                      </label>
                    <NumericInput
                      value={percentageMin}
                      onChange={setPercentageMin}
                      min={1}
                      max={100}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Percentage Max <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 100)</span>
                      </label>
                      <NumericInput
                        value={percentageMax}
                        onChange={setPercentageMax}
                        min={1}
                        max={100}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Number Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span>
                      </label>
                      <NumericInput
                        value={percentageNumberDigits}
                        onChange={setPercentageNumberDigits}
                        min={1}
                        max={10}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Time Limit per Question <span className="text-gray-500 font-normal text-xs">(seconds, Min: 5, Max: 300)</span>
                  </label>
                  <NumericInput
                    value={timeLimit}
                    onChange={setTimeLimit}
                    min={5}
                    max={300}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                  />
                </div>
              </>
            )}

            {/* Add/Sub specific inputs */}
            {operationType === "add_sub" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Number of Digits <span className="text-gray-500 font-normal text-xs">(Min: 1, Max: 10)</span>
                  </label>
                    <NumericInput
                      value={addSubDigits}
                      onChange={setAddSubDigits}
                      min={1}
                      max={10}
                      className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Number of Rows <span className="text-gray-500 font-normal text-xs">(Min: 2, Max: 20)</span>
                      </label>
                      <NumericInput
                        value={addSubRows}
                        onChange={setAddSubRows}
                        min={2}
                        max={20}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Duration <span className="text-gray-500 font-normal text-xs">(seconds, Min: 0.1, Max: 10, Step: 0.1)</span>
                      </label>
                      <DecimalNumericInput
                        value={addSubRowTime}
                        onChange={setAddSubRowTime}
                        min={0.1}
                        max={10}
                        step={0.1}
                        className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 font-semibold shadow-sm hover:shadow-md transition-all outline-none bg-white text-slate-900"
                    />
                    </div>
              </>
            )}

            {/* Start Button */}
            <div className="pt-8 border-t-2 border-purple-100 mt-10">
              <button
                onClick={startCountdown}
                className="group w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Play className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Practice</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

