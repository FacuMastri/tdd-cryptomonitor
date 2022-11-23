import { Rules } from '../../interpreter/types/rule';
import { Value } from '../../interpreter/types/value';
import InMemoryRuleRepository from '../../repositories/InMemoryRuleRepository';
import InMemoryUserRepository from '../../repositories/InMemoryUserRepository';
import InMemoryVariableRepository from '../../repositories/InMemoryVariableRepository';
import UserRepository from '../../repositories/UserRepository';
import { encrypt } from '../../services/encryption';
import { User } from '../../users';

describe('Rule Repository', () => {
  test('should be able to set rules', async () => {
    const repository = new InMemoryRuleRepository();

    const rules: Rules = {
      requiredVariables: ['TDD/USDT'],
      rules: [
        {
          name: 'Comprar 12 TDD/USDT siempre',
          condition: {
            type: 'CONSTANT',
            value: true
          },
          actions: [
            {
              type: 'BUY_MARKET',
              symbol: 'TDD/USDT',
              amount: {
                type: 'CONSTANT',
                value: 12
              }
            }
          ]
        }
      ]
    };

    await repository.setRules(rules);

    const repositoryRules = await repository.getRules();

    expect(repositoryRules).toEqual(rules);
  });
});

describe('Variable Repository', () => {
  test('should be able to set variables', async () => {
    const repository = new InMemoryVariableRepository();

    const name = 'TDD/USDT';
    const value: Value = {
      type: 'CONSTANT',
      value: 12
    };

    await repository.setVar(name, value);

    const repositoryVariables = await repository.getVars();

    expect(repositoryVariables[name]).toEqual(value);
  });
});

describe('User Repository', () => {
  const defaultUser: User = {
    id: 1,
    user: 'default',
    password: 'default',
    cypher: encrypt('default')
  };

  const repository: UserRepository = new InMemoryUserRepository({
    1: defaultUser
  });

  test('findUserById finds user', async () => {
    const user = await repository.findUserById(1);

    expect(user).toEqual(defaultUser);
  });

  test('findUserById fails with non-existent user', async () => {
    const user = await repository.findUserById(10);

    expect(user).toEqual(undefined);
  });

  test('findUserByName finds user', async () => {
    const user = await repository.findUserByName('default');

    expect(user).toEqual(defaultUser);
  });

  test('findUserByName fails with non-existent user', async () => {
    const user = await repository.findUserByName('non-existent');

    expect(user).toEqual(undefined);
  });

  test('findUserByNameAndPassword finds user', async () => {
    const user = await repository.findUserByNameAndPassword(
      'default',
      'default'
    );

    expect(user).toEqual(defaultUser);
  });

  test('findUserByNameAndPassword fails with non-existent user', async () => {
    const user = await repository.findUserByNameAndPassword('actix', 'default');

    expect(user).toEqual(undefined);
  });

  test('findUserByNameAndPassword fails with wrong password', async () => {
    const user = await repository.findUserByNameAndPassword('default', 'actix');

    expect(user).toEqual(undefined);
  });
});
