const tree = require('./tree.json');
const readline = require('readline');

let currentId = "1";
let score = { int_locus: 0, growth: 0, altro: 0 };

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function updateScore(signal) {
    if (signal === "int_locus") score.int_locus++;
    else if (signal === "growth") score.growth++;
    else if (signal === "altro") score.altro++;
}

function playNode(id) {
    const node = tree.nodes.find(n => n.id === id);
    console.log(`\n[${node.type.toUpperCase()}]: ${node.text}`);

    if (node.type === "end") {
        console.log("\n=== FINAL SCORES ===");
        console.log(`Internal Locus: ${score.int_locus}`);
        console.log(`Growth Mindset: ${score.growth}`);
        console.log(`Contribution to Others: ${score.altro}`);
        rl.close();
        return;
    }

    if (node.type === "question") {
        node.options.forEach((opt, i) => {
            console.log(`  ${i + 1}. ${opt.text}`);
        });
        
        rl.question("Your choice (1-" + node.options.length + "): ", (answer) => {
            const choice = parseInt(answer) - 1;
            if (choice >= 0 && choice < node.options.length) {
                updateScore(node.options[choice].signal);
                playNode(node.options[choice].next_node);
            } else {
                console.log("Invalid choice. Try again.");
                playNode(id);
            }
        });
    } else if (node.type === "decision") {
        const scores = [score.int_locus, score.growth, score.altro];
        const maxScore = Math.max(...scores);
        const winnerIndex = scores.indexOf(maxScore);
        const summaryIds = ["22", "23", "24"];
        playNode(summaryIds[winnerIndex]);
    } else {
        // Auto-advance for reflections/bridges
        playNode(node.next_node);
    }
}

playNode(currentId);