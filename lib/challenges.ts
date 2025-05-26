export interface Challenge {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  hint?: string
  starterCode: string
  solution: string
  solutionKeywords: string // Simplified for demo - in a real app, we'd use tests
}

export const challenges: Challenge[] = [
  {
    id: "fibonacci",
    title: "Fibonacci Sequence",
    difficulty: "Easy",
    description:
      "Write a function that returns the nth number in the Fibonacci sequence. The Fibonacci sequence is defined as: F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1.",
    hint: "Consider using recursion with memoization or an iterative approach for better performance.",
    starterCode: `def fibonacci(n):
    # Your code here
    pass

# Test your function
print(fibonacci(10))  # Should output 55
`,
    solution: `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Test your function
print(fibonacci(10))  # Should output 55
`,
    solutionKeywords: "a, b = b, a + b",
  },
  {
    id: "palindrome",
    title: "Palindrome Checker",
    difficulty: "Easy",
    description:
      "Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward, ignoring spaces, punctuation, and capitalization.",
    starterCode: `def is_palindrome(text):
    # Your code here
    pass

# Test your function
print(is_palindrome("racecar"))  # Should output True
print(is_palindrome("hello"))    # Should output False
`,
    solution: `def is_palindrome(text):
    # Convert to lowercase and remove non-alphanumeric characters
    text = ''.join(c.lower() for c in text if c.isalnum())
    
    # Check if the string equals its reverse
    return text == text[::-1]

# Test your function
print(is_palindrome("racecar"))  # Should output True
print(is_palindrome("hello"))    # Should output False
`,
    solutionKeywords: "text[::-1]",
  },
  {
    id: "prime",
    title: "Prime Number Checker",
    difficulty: "Medium",
    description:
      "Write a function that determines whether a given number is prime. A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.",
    hint: "You only need to check divisibility up to the square root of the number.",
    starterCode: `def is_prime(n):
    # Your code here
    pass

# Test your function
print(is_prime(7))   # Should output True
print(is_prime(15))  # Should output False
`,
    solution: `def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    
    # Check if n is divisible by 2 or 3
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    # Check all numbers of form 6k ± 1 up to sqrt(n)
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
        
    return True

# Test your function
print(is_prime(7))   # Should output True
print(is_prime(15))  # Should output False
`,
    solutionKeywords: "i * i <= n",
  },
]
