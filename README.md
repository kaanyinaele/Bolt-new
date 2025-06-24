# RubikconInvoice - Decentralized Invoicing Platform

A trustless, decentralized invoicing solution built on the Ethereum blockchain. RubikconInvoice allows users to create, manage, and track invoices with transparent, secure transactions using smart contracts.

## 🌟 Features

- **Web3 Wallet Integration**
  - Connect with MetaMask or any Web3 wallet
  - Secure, non-custodial transactions
  - Real-time wallet balance and network status

- **Invoice Management**
  - Create and send professional invoices
  - Track invoice status (Created, Funded, Completed, Cancelled)
  - View transaction history and payment status
  - Automated fiat currency conversion

- **Smart Contract Backend**
  - Secure, transparent transactions on the Ethereum blockchain
  - Immutable invoice records
  - Programmable escrow functionality

- **User Experience**
  - Clean, intuitive interface
  - Responsive design for all devices
  - Real-time updates and notifications

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, Solidity, ethers.js
- **Development**: Vite, Hardhat
- **Testing**: Mocha, Chai
- **CI/CD**: GitHub Actions

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask browser extension
- Access to an Ethereum network (Mainnet, Goerli, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kaanyinaele/RubikconInvoice.git
   cd RubikconInvoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

## 📝 Smart Contract Deployment

1. **Compile the contracts**
   ```bash
   npx hardhat compile
   ```

2. **Run tests**
   ```bash
   npx hardhat test
   ```

3. **Deploy to a network**
   ```bash
   npx hardhat run scripts/deploy.ts --network <network_name>
   ```

## 📊 Project Structure

```
src/
├── components/       # Reusable UI components
├── contracts/        # Smart contract source files
├── hooks/            # Custom React hooks
├── pages/            # Application pages
├── styles/           # Global styles
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using [Bolt.new](https://bolt.new/)
- Inspired by the need for decentralized financial tools
- Thanks to the Ethereum community for amazing developer tools

## 📧 Contact

For inquiries or support, please contact [kaanyinaele@gamil.com] or open an issue on GitHub.

---

<div align="center">
  Made with ❤️ by Kaanyi
</div>
