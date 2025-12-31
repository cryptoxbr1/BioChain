import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  clusterApiUrl,
  TransactionInstruction
} from "@solana/web3.js";

// Memo Program ID (Mainnet/Devnet)
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb");

// Type definition for the window.solana object injected by Phantom/Solflare
interface SolanaProvider {
  isPhantom?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
  on: (event: string, callback: (args: any) => void) => void;
  removeListener: (event: string, callback: (args: any) => void) => void;
  publicKey: PublicKey | null;
}

const getProvider = (): SolanaProvider | null => {
  if ('solana' in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  return null;
};

export const connectWallet = async (): Promise<string | null> => {
  const provider = getProvider();
  if (!provider) {
    window.open("https://phantom.app/", "_blank");
    return null;
  }

  try {
    const resp = await provider.connect();
    return resp.publicKey.toString();
  } catch (err) {
    console.error("User rejected request", err);
    return null;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  const provider = getProvider();
  if (provider) {
    await provider.disconnect();
  }
};

export const verifyJobOnChain = async (jobId: string, moleculeName: string, score: number): Promise<string> => {
  const provider = getProvider();
  if (!provider || !provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Create verification payload
  const verificationData = JSON.stringify({
    app: "BioChain",
    jobId,
    molecule: moleculeName,
    score: score,
    timestamp: Date.now()
  });

  // Create transaction
  const transaction = new Transaction();
  
  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = provider.publicKey;

  // Add Memo Instruction
  transaction.add(
    new TransactionInstruction({
      keys: [{ pubkey: provider.publicKey, isSigner: true, isWritable: true }],
      programId: MEMO_PROGRAM_ID,
      data: new TextEncoder().encode(verificationData) as any,
    })
  );

  // Optional: Add a tiny transfer to self to ensure it shows up prominently in explorers, 
  // but Memo is enough for proof. We stick to just Memo for cost efficiency (just fees).

  try {
    const { signature } = await provider.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature, 'processed');
    return signature;
  } catch (err) {
    console.error("Transaction failed", err);
    throw new Error("Failed to sign and send transaction");
  }
};

export const checkWalletConnection = async (): Promise<string | null> => {
  const provider = getProvider();
  if (provider && provider.publicKey) {
    return provider.publicKey.toString();
  }
  // Try eager connect if trusted
  if (provider) {
      try {
          const resp = await provider.connect({ onlyIfTrusted: true });
          return resp.publicKey.toString();
      } catch {
          return null;
      }
  }
  return null;
};