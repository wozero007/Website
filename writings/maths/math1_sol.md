# Solution to Question 1

In Question 1, I asked whether it is possible to build a Taylor series expansion of  
$$ f(z) = \sqrt{(\pi + e z) + i(\pi - e z)} $$  
around the point \( z_0 = 1 + i \), and if so, how far it converges.

The function involves a square root, which is multi-valued, so its analyticity depends on the branch chosen. We shall consider the principal branch of the square root, which places a branch cut along the set of complex numbers where the argument of the root lies on the non-positive real axis.

Let \( z = x + i y \). Then,  
$$ (\pi + e z) + i(\pi - e z) = (\pi + e x + e y) + i(\pi - e x + e y), $$  
which we rewrite as \( A + i B \), where  
$$ A = \pi + e x + e y, \quad B = \pi - e x + e y. $$  

The branch cut occurs where \( B = 0 \) and \( A \leq 0 \). Solving,  
$$ \pi - e x + e y = 0 \Rightarrow y = x - \frac{\pi}{e}, $$  
and substituting into \( A \leq 0 \) gives:  
$$ \pi + e x + e\left(x - \frac{\pi}{e}\right) = 2 e x \leq 0 \Rightarrow x \leq 0. $$  

So the branch cut lies along the line  
$$ y = x - \frac{\pi}{e}, \quad x \leq 0. $$  

To determine the radius of convergence of the Taylor series around \( z_0 = 1 + i \), we compute the Euclidean distance from \( z_0 \) to its nearest point on this branch cut. Since the function is analytic in the open disk centered at \( z_0 \) that avoids the cut, this distance gives the radius of convergence.

Therefore, the Taylor series exists and converges in a neighborhood of \(1 + i\), and its radius of convergence is equal to the distance from \(1 + i\) to the nearest point on the branch cut, which is \(-i \frac{\pi}{e}\) [1, p.167]. Thus,  
$$ R = \left| (1 + i) - \left( -i \frac{\pi}{e} \right) \right| = \sqrt{1 + \left(1 + \frac{\pi}{e}\right)^2}. $$ 

---

**Reference:**  
[1] S. Ponnusamy, *Foundations of Complex Analysis (2nd edition)*, Narosa Publishing House, New Delhi, 2005.
