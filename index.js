/*----------variaveis global-------------------*/

const readline = require('readline');//modulo para ler o arquivo do computador, linha por linha
const fileSystem = require('fs'); // modulo vai fornecer a interação com o sistema de arquivos do  computador 
const EventEmitter = require('events');// armasena uma clase e dentro dela tem varios eventos 
const { error } = require('console');
const eventEmitter = new EventEmitter();//vai criar uma copia um rascunho para os eventos 

const leitor = readline.createInterface(
    {
        input: process.stdin, // pega as informações do teclado
        output: process.stdout, // exibe no terminal 
    }
);

/*--------------funçõe------*/
function programaPrincipal(){
//- peça o caminho de um arquivo txt do seu computador
leitor.question('\nDigite o caminho do arquivo [exemplo.txt]: ', (caminho_do_arquivo) => { 

    const caminho = caminho_do_arquivo.toLowerCase()

    console.time('quanto tempo durou a execução');
   

    async function lerArquivo( ) {
        await fileSystem.readFile(caminho, 'utf-8', (erro, dados) => {
            if (erro) {
                console.log('-> Erro ao ler o arquivo !');
                leitor.close(); 
                return
            }
            const linhas_do_arquivo = dados.split(/\r?\n/ );   
            let total_linhas_somente_numeros = 0;  
            let total_somente_numeros_na_linha = 0;     
            let total_linhas_texto = 0; 
            const numeros_arquivo = [];
                   
            //conte quantas linhas possuem o arquivo;

            for (let i = 0 ; i < linhas_do_arquivo.length; i++ ){    

               
                //verifica se a string possui somente números
                if(/^\d+$/.test(linhas_do_arquivo[i])){
                    
                    total_linhas_somente_numeros++;
                    total_somente_numeros_na_linha += Number(linhas_do_arquivo[i]);        

                    //conte quantas linhas possuem texto
                } 
                   //verifica se a string não possui somente números 
                if((!/^\d+$/.test(linhas_do_arquivo[i]))){              
                    //conte quantas linhas possuem texto
                    console.log(linhas_do_arquivo[i]);
                   total_linhas_texto ++;

                } 
                
                numeros_arquivo.push(Number(linhas_do_arquivo[i].replace( /[^0-9]/g ,'')));
              
            }
           const soma_numeros = numeros_arquivo.reduce((acumulador, valor) => acumulador + valor);

           //-
           const resumo = {
            total_linhas_somente_numeros : total_linhas_somente_numeros,
            total_somente_numeros_na_linha : total_somente_numeros_na_linha,
            total_linhas_texto : total_linhas_texto,
            soma_numeros : soma_numeros,
            total_linhas_texto : total_linhas_texto,
            caminho_do_arquivo : caminho_do_arquivo,

           }

            //-O resumo deverá ser diparado po Evento
            eventEmitter.emit('exibirResumo',resumo);

           //exibirResumo(resumo);         

            //-quanto tempo durou a execução
            console.timeEnd('quanto tempo durou a execução');

            solictarPerguntaNovaExecucao();
        });
        
    }

    lerArquivo();
    console.log();
    
})
}

function executaProgramaPrincipal(){
    programaPrincipal();
};

function exibirResumo(resumo){
     /* //-conte quantas linhas possuem o arquivo;
      console.log(`conte quantas linhas possuem somente números: ${resumo.total_linhas_somente_numeros}`);

      //-conte quantas linhas possuem somente números e some o números destas linhas 
      console.log(`soma dos nùmeros destas linhas : ${resumo.total_somente_numeros_na_linha}`);

      //-conte quantas linha possuem texto
      console.log(`total de linhas deste texto : ${resumo.total_linhas_texto}`);

      //-soma dos números dentro deste arquivo
      console.log(`soma dos números dentro deste arquivo: ${resumo.soma_numeros}`);

      //-quantas linhas continham texto e número (se tiver texto e número na mesma linha deverá contar aqui)
      console.log(`total de linhas texto e número na mesma linha : ${resumo.total_linhas_texto}`);

      //- Perguinte se deseja executar novamente*/


    console.log(`\n=> Resumo do Arquivo ${resumo. caminho_do_arquivo}`);

    console.table([
        ['conte quantas linhas possuem somente números' , resumo.total_linhas_somente_numeros],
        ['soma dos nùmeros destas linhas' , resumo.total_somente_numeros_na_linha],
        ['total de linhas deste texto' , resumo.total_linhas_texto],
        ['soma dos números dentro deste arquivo' , resumo.soma_numeros],
        ['total de linhas texto e número na mesma linha' , resumo.total_linhas_texto],

    ]);

     

}

function  solictarPerguntaNovaExecucao(){
    leitor.question('\nQuer executarnovamente,[S/N]?',  (resposta ) =>{
        const resposta_em_minuscula = resposta.toLowerCase()

        if (resposta_em_minuscula === 's' || resposta_em_minuscula === 'sim'){
            eventEmitter.emit('recebeuRespostaSim')
                    }
        else if (resposta_em_minuscula === 'n' || resposta_em_minuscula === 'nao' || resposta_em_minuscula === 'não'){
           eventEmitter.emit('recebeuRespostaNao');
        }
        else {
            eventEmitter.emit('recebeuRespostaInvalida');
        }      
       
    });

}

function processarRespostaNao( ){
    console.log('Finalizado Programa !!');
    leitor.close(); 
};

function processarRespostaInvalida( ){
    console.log('Resposta Somete [S/N] !');
    solictarPerguntaNovaExecucao();
};

/*----------eventos-------------------*/

eventEmitter.on('exibirResumo', (resumo) => {
    exibirResumo(resumo);
})

eventEmitter.on('recebeuRespostaSim', ( ) => {
    executaProgramaPrincipal();
})

eventEmitter.on('recebeuRespostaNao' , ( ) => {
    processarRespostaNao()
})

eventEmitter.on('recebeuRespostaInvalida', ( ) => {
    processarRespostaInvalida( );
});

/*----------programa principal-------*/
executaProgramaPrincipal()