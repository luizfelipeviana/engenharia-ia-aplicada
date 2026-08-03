import tf from '@tensorflow/tfjs-node';

async function trainModel(inputXs, outputYs) {
    const model = tf.sequential()

    // Primeira camada da rede
    // entrada de 7 posicoes (idade normalizada + 3 cores + 3 localizacoes)

    // 80 neuronios = aqui colocamos tudo isso, pq tem pouca base de treino
    // quanto mais, mais complexidade a rede pode aprender e processar melhor

    // A ReLU age como um filtro: deixando apenas os dados interessantes seguirem
    // Se chegou no neunorio positivo -> segue
    // Se zero ou negativa -> joga fora (remove)
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }))

    // Saida: 3 neuronios 
    // um para cada categoria

    // activation: softmax, normaliza a saida em probabilidades
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }))

    // Compilando o modelo
    // optimizer Adam
    // Treinador pessoal moderno de redes neruais
    // Ajusta os pesos de forma eficiente e inteligente
    // Aprender com erros e acertos

    // loss: categoricalCrossentropy
    // Compara o que o modelo acha com a resposta certa

    // a categoria premium [1, 0, 0]

    // quanto mais distante da previsão do modelo da resposta correta, maior o erro
    // Exemplo classico: classificacao de imagens, recomendação e categorização de usuário
    // qualquer coisa em que a resposta certa é apenas uma das categorias
    model.compile({ 
        optimizer: 'adam', 
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    })

    // Treinamento do modelo 
    // verbose: desabilita o log interno e usa só callback
    // epochs: quantidade de execucoes no dataset
    // shuffle: embaralha os dados, para evitar viés
    await model.fit(
        inputXs, 
        outputYs, 
        {
            verbose: 0,
            epochs: 100,
            shuffle: true,
            callbacks: {
                onEpochEnd: (epoch, log) => console.log(
                    `Epoch: ${epoch}: loss = ${log.loss}`
                )
            }
        }
    )

    return model
}

async function predict(model, pessoa) {
    // transformar array js para o tensor (tfjs)
    const tfInput = tf.tensor2d(pessoa)

    // Faz a predicao (output sera um vetor de 3 probabilidades)
    const pred = model.predict(tfInput)
    const predArray = await pred.array()
    console.log(predArray)

    return predArray[0].map((prob, index) => ({prob, index}))
}

// Exemplo de pessoas para treino (cada pessoa com idade, cor e localização)
// const pessoas = [
//     { nome: "Erick", idade: 30, cor: "azul", localizacao: "São Paulo" },
//     { nome: "Ana", idade: 25, cor: "vermelho", localizacao: "Rio" },
//     { nome: "Carlos", idade: 40, cor: "verde", localizacao: "Curitiba" }
// ];

// Vetores de entrada com valores já normalizados e one-hot encoded
// Ordem: [idade_normalizada, azul, vermelho, verde, São Paulo, Rio, Curitiba]
// const tensorPessoas = [
//     [0.33, 1, 0, 0, 1, 0, 0], // Erick
//     [0, 0, 1, 0, 0, 1, 0],    // Ana
//     [1, 0, 0, 1, 0, 0, 1]     // Carlos
// ]

// Usamos apenas os dados numéricos, como a rede neural só entende números.
// tensorPessoasNormalizado corresponde ao dataset de entrada do modelo.
const tensorPessoasNormalizado = [
    [0.33, 1, 0, 0, 1, 0, 0], // Erick
    [0, 0, 1, 0, 0, 1, 0],    // Ana
    [1, 0, 0, 1, 0, 0, 1]     // Carlos
]

// Labels das categorias a serem previstas (one-hot encoded)
// [premium, medium, basic]
const labelsNomes = ["premium", "medium", "basic"]; // Ordem dos labels
const tensorLabels = [
    [1, 0, 0], // premium - Erick
    [0, 1, 0], // medium - Ana
    [0, 0, 1]  // basic - Carlos
];

// Criamos tensores de entrada (xs) e saída (ys) para treinar o modelo
const inputXs = tf.tensor2d(tensorPessoasNormalizado)
const outputYs = tf.tensor2d(tensorLabels)

// inputXs.print();
// outputYs.print();

// quanto mais dado melhor!
const model = await trainModel(inputXs, outputYs)

const pessoa = { 
    nome: 'Viana', 
    cor: 'verde', 
    localizacao: 'Curitiba', 
    idade: 28
}

// normalizar a idade nova usando o mesmo padrao
// Exemplo: idade_min = 28, idade_max = 40, entao (28-25) / (40-25) = 0.2

const pessoaTensorNormalizado = [
    [
        0.2,    // idade normalizada
        0,      // cor azul
        0,      // cor vermelho
        1,      // cor verde
        1,      // localizacao São Paulo
        0,      // localizacao Rio
        0,      // localizacao Curitiba
    ]
]

const predictions = await predict(model, pessoaTensorNormalizado)

const results = predictions
    .sort((a, b) => b.prob - a.prob)
    .map(p => `${labelsNomes[p.index]} (${(p.prob * 100).toFixed(2)}%)`)
    .join('\n')

console.log(results)