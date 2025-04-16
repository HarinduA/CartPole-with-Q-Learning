import gym
import numpy as np
import matplotlib.pyplot as plt
import os

env = gym.make("CartPole-v1")
obs_space = env.observation_space.shape[0]
action_space = env.action_space.n

# Discretize the observation space
bins = [6, 6, 6, 6]
obs_bins = [
    np.linspace(-4.8, 4.8, bins[0]),
    np.linspace(-5, 5, bins[1]),
    np.linspace(-0.418, 0.418, bins[2]),
    np.linspace(-5, 5, bins[3]),
]

def discretize(obs):
    return tuple(
        np.digitize(obs[i], obs_bins[i]) for i in range(len(obs))
    )

# Q-table shape = (state_space for each obs dim, action_space)
q_table = np.random.uniform(low=0, high=1, size=(6, 6, 6, 6, action_space))

# Hyperparameters
alpha = 0.1
gamma = 0.99
epsilon = 1.0
epsilon_decay = 0.995
min_epsilon = 0.01

episodes = 1000
rewards = []

for ep in range(episodes):
    obs, _ = env.reset()
    state = discretize(obs)
    total_reward = 0

    done = False
    while not done:
        # Uncomment this to watch the bot play (after 300+ episodes)
        # if ep > 800: env.render()

        # Epsilon-greedy
        if np.random.random() < epsilon:
            action = env.action_space.sample()
        else:
            action = np.argmax(q_table[state])

        next_obs, reward, done, _, _ = env.step(action)
        new_state = discretize(next_obs)

        best_future_q = np.max(q_table[new_state])
        q_table[state + (action,)] += alpha * (reward + gamma * best_future_q - q_table[state + (action,)])

        state = new_state
        total_reward += reward

    epsilon = max(min_epsilon, epsilon * epsilon_decay)
    rewards.append(total_reward)

    if (ep + 1) % 100 == 0:
        print(f"Episode {ep + 1}: Reward = {total_reward:.1f}, Epsilon = {epsilon:.3f}")

env.close()

# Plot results
if not os.path.exists("results"):
    os.makedirs("results")

plt.plot(rewards)
plt.xlabel("Episodes")
plt.ylabel("Total Reward")
plt.title("Training Progress")
plt.savefig("results/rewards_plot.png")
plt.show()
